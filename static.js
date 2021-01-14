const connect = require("connect");



const superstatic = require("superstatic");

var app = connect()
	.use(superstatic({
		config: {
			"public": "_site",
			"cwd": process.cwd(),
			"cleanUrls": true
		}
	}));

app.listen(process.env.PORT || 3000, function() {
console.log("Server is running")
});