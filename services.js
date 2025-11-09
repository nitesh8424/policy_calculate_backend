const jwt = require('jsonwebtoken');
const Users = require('./models/users.model');
const { premium_calculation } = require('./utils/calculation');

const login = async (data) => {
    const { username, password } = data;

    if (!username || !password) {
        return { success: false, message: 'Username and password are required' };
    }
    const userFetched = await Users.findOne({ username });
    if (!userFetched) {
        return { success: false, message: 'user not found', status: 404 };
    } else if (userFetched && !(await userFetched.comparePassword(password))) {
        return { success: false, message: 'username and password do not match', status: 401 };
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
        const userFetched = await Users.findOne({ username });
        if (userFetched) {
            // await userFetched.decryptFields();
            return { success: false, message: 'Username already exists' };
        }
            const users = new Users({
                username, password, name, dob, gender, mobile
            })
            await users.save();
            return { success: true, message: 'Registration successful' };

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

module.exports = {
    login,
    register,
    getPolicyDetails,
    verifyToken,
    policyCalculation
};