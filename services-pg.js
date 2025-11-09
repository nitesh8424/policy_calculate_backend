const jwt = require('jsonwebtoken');
const pool = require('./db/pg.db.connection');
const { premium_calculation } = require('./utils/calculation');

const login = async (data) => {
    const { username, password } = data;

    if (!username || !password) {
        return { success: false, message: 'Username and password are required' };
    }
    const userFetched = await pool.query('select * from user_details where username = $1 limit 1', [username]);
    if (userFetched.rows.length > 0) {
        return { success: false, message: 'Username already exists' };
    } else if (userFetched.rows[0].password !== password) {
        return { success: false, message: 'Username and password do not match', status: 401 };
    }

    try {
        const accessToken = await new Promise((resolve, reject) => {
            jwt.sign({ username }, 'secretkey', { expiresIn: '10m' }, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
        return { success: true, message: 'Login successful', accessToken, status: 200 };
    } catch (err) {
        return { success: false, message: 'Token generation failed' };
    }
};

const register = async (data) => {
    try {
        // Logic for user registration
        const { username, password, name, dob, gender, mobile } = data;
        // Register user
        const userFetched = await pool.query('select * from user_details where username = $1 limit 1', [username]);
        if (userFetched.rows.length === 0) {
            return { success: false, message: 'Username already exists' };
        }

        const inserted = await pool.query(
            'INSERT INTO user_details(username, password, name, dob, gender, mobile) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [username, password, name, dob, gender, mobile]
        );

        if (inserted.rowCount === 1) {
            return { success: true, message: 'Registration successful' };
        }

    } catch (error) {
        console.log('error', error)
        return { success: false, message: 'Registration failed' };
    }
}

const getPolicyDetails = async (req) => {
    // Logic for getting policy details
    const { policyId } = req.params;
    // Fetch policy details
    return {
        dob: '1995/05/12',
        gender: 'M',
        sum_assured: '1,200,000',
        modal_premium: '80,000',
        premium_frequency: 'Yearly',
        pt: 18,
        ppt: 10
    };
}

const policyCalculation = async (data) => {
    try {
        const validate = validateSumAssured(Number(data.modal_premium), Number(data.sum_assured), data.premium_frequency);
        if (!validate.valid) {
            return { success: false, message: validate.message }
        }
        const policy_cal = await premium_calculation(data)
        return { success: true, data: policy_cal, status: 200 };
    } catch (error) {
        return { success: false, message: 'policy calculation failed' };
    }
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Access token is required' });
    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid access token' });
        req.user = user;
        next();
    });
};

function validateSumAssured(premium, sumAssured, frequency) {
    let annualPremium;

    if (frequency === 'Monthly') {
        annualPremium = premium * 12;
    } else if (frequency === 'Half-Yearly') {
        annualPremium = premium * 2;
    } else {
        annualPremium = premium;
    }

    const minRequired = Math.min(annualPremium * 10, 5000000);

    if (sumAssured < minRequired) {
        return {
            valid: false,
            message: `Sum Assured must be at least ₹${minRequired.toLocaleString()} based on your premium`
        };
    }

    return { valid: true };
}

module.exports = {
    login,
    register,
    getPolicyDetails,
    verifyToken,
    policyCalculation
};