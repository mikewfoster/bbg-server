const router = require('express').Router();

router.get('/', function (req, res) {
    res.json({
        success: true
    });
});

module.exports = router;