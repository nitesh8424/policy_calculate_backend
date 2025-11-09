const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const { login, register, getPolicyDetails, verifyToken, policyCalculation } = require('./services');

const connectDB = require('./db/db.connection');

// Middleware
app.use(bodyParser.json());
app.use(cors());

connectDB();

// Sample route
app.post('/login', async(req, res) => {
    try {
        const loginData = await login(req.body);
        const statusCode = loginData.status;
        delete loginData.status;
        res.status(statusCode || 200).json(loginData);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

app.post('/register', async(req, res) => {
    try {
        const registerData = await register(req.body);
        const statusCode = registerData.status;
        delete registerData.status;
        res.status(statusCode || 200).json(registerData);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

app.use(verifyToken);

app.get('/get_policy_details', async(req, res) => {
    try {
        const policyDetails = await getPolicyDetails(req);
        res.status(200).json(policyDetails);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve policy details', error: error.message });
    }
});

app.post('/policy_calculation', async(req, res) => {
    try {
        const policyData = await policyCalculation(req.body);
        const statusCode = policyData.status;
        delete policyData.status;
        res.status(statusCode || 200).json(policyData);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve policy details', error: error.message });
    }
});


app.listen(5000, () => {
    console.log('Backend Service is running on port 5000');
})
// create table policy_info (
//     policy_id INT PRIMARY KEY,
//     policy_type VARCHAR(50) NOT NULL,
//     policy_premium DECIMAL(10, 2) NOT NULL,
//     policy_riders VARCHAR(255)
// )

// Develop an algorithm to calculate projected benefits based on policy
// parameters, premium payments, and policyholder age
