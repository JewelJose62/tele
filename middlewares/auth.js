const jwt = require('jsonwebtoken');

// Protect route (only logged-in users can access)
exports.protect = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.redirect('/login'); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use environment variable for secret
        req.user = decoded;  // Attach decoded user info to request object
        next();
    } catch (error) {
        req.session.destroy(() => {
            return res.redirect('/login'); // Destroy session and redirect to login
        });
    }
};

// Redirect logged-in users to /chat if they try to access login/signup
exports.bypass = (req, res, next) => {
    const token = req.session.token;

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);  // Verify token
            return res.redirect('/chat'); // Redirect logged-in users to chat
        } catch (error) {
            req.session.destroy(() => {
                // Destroy invalid session and continue
            });
        }
    }

    next();  // Allow access to login/signup if no valid session
};
