const express = require("express");
const serveStatic = require("serve-static")
var app = express();
const path = require("path")

function requireHTTPS(req, res, next) { 
	/* The 'x-forwarded-proto' check is for Heroku */
if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
	return res.redirect('https://' + req.get('host') + req.url);
	} 
	next();
}
app.use(requireHTTPS);
app.use("/", serveStatic(path.join(__dirname, "_site"), {
	lastModified: true,
	extensions: ["html"]
}))

app.listen(process.env.PORT || 3000, () => console.log("Server is running!"))