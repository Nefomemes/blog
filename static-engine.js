const express = require("express");
const fs = require("fs");
const dirtree = require("directory-tree");
const ejs = require("ejs");
const path = require("path");
const mime = require("mime");

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

const runLoop = (tree, callback, app, configs) => {



for (let child of tree.children){
	
	if(child.children) { runLoop(child, callback, app, configs);
	} else {
		callback(child, tree, app, configs);
	}
	
		
	}
	
}

const addRoute = (child, tree, app, configs) => {
	child.webpath = child.path.slice(tree.path.length);
	if([".html", ".ejs"].includes(child.extension)){
		if(child.name.toLowerCase() === "index" +  child.extension) {
		child.webpath = child.webpath.slice(0, child.name * -1);
	}
	}
if(child.extension === "ejs"){
	child.webpath = child.webpath.slice(0, child.extension.length * -1);
	
app.get(child.webpath, (req, res) => {

	
	
	res.type(".html")
	 res.locals["view engine"] = "ejs";
	 return res.render(child.path, {req: req, res: res});
	
	
}
	);
} else {
	app.get(child.webpath, (req, res) => {
		res.header("Content-Type", mime.getType(child.extension.slice(1)));
				res.sendFile( child.path) })
	}
}
	
	

	module.exports = (configs) => {
		
var app = express.Router()
app.use(requireHTTPS);
const tree = dirtree(path.join(configs.dir, configs.name));

runLoop(tree, addRoute, app, configs );
app.get("*", (req, res) => {
	res.setHeader('content-type', 'application/html')
	 
	 if(tree.children.find(i => !i.children && i.name === "404.ejs")) {
	 	res.locals["view engine"] = "ejs";
	 	return res.render(path.join(configs.name, "404.ejs"), {req: req, res: res});
	 } else if(tree.children.find(i => !i.children && i.name === "404.html")) { return res.status(404).sendFile(path.join(__dirname, configs.name, "404.html")) } else res.se
	
});
return app;

	
}