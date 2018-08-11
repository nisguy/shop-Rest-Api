const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secretKey");
        req.userDetails = decoded;
        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            text: "Auth failed"
        });
    }
};