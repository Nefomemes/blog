const express = require("express");

var app = express();


app.use("/", require("./static-engine")({
	dir: __dirname,
	name: "_site"
}))

app.listen(process.env.PORT || 3000, () => console.log("Server is running!"))