const jwt = require('jsonwebtoken');

// Protect route (only logged-in users can access)
exports.protect = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.redirect('/login'); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded;  
        next();
    } catch (error) {
        req.session.destroy(() => {
            return res.redirect('/login'); 
        });
    }
};


exports.bypass = (req, res, next) => {
    const token = req.session.token;

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET); 
            return res.redirect('/chat'); 
        } catch (error) {
            req.session.destroy(() => {
                
            });
        }
    }

    next();  
};
