var path = require("path");
var express = require("express");
var router = express.Router();

// Vista principal
router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname,"../views/index.html"));
});

module.exports = router;