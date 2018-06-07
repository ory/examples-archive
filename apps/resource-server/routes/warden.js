const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();

router.get('/', jwt({
    secret: client
}), function (req, res, next) {
    res.json({ message: 'Congratulations, you gained access to this endpoint!', tokenClaims: req.user });
});

/* GET home page. */
module.exports = router;
