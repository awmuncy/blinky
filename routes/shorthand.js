var express  = require("express");
var router = express.Router();
var fetch = require("node-fetch");

router.get("/", (req, res) => {
	res.json({
        metadata: [
            {name: "Author", value: "Allen Muncy"}
        ],
        links: [
            {name: 'self', href: '/shorthand'},
            {name: 'home', href: '/'},
            {name: 'pom', href: '/shorthand/p-start', method: 'GET'}
        ]		
	});
});

router.get("/off", (req, res) => {
    fetch("http://localhost/0-31/000000");
    res.json({success: true});
});



module.exports = router;