const express = require("express");
const fs = require("fs");
const dirtree = require("directory-tree");
const ejs = require("ejs");
const path = require("path");

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
	child.webpath = child.webpath.slice(0, child.extension.length * -1);
	if(child.name.toLowerCase() === "index" +  child.extension) {
		child.webpath = child.webpath.slice(0, child.name * -1);
	}
app.get(child.webpath, (req, res) => res.send(ejs.renderFile(child.path, {req: req, res: res})));
} else {
	app.get(child.webpath, (req, res) => res.send( child.path)))
}
	
	
};

	module.exports = (configs) => {
		
var app = express.Router()
app.use(requireHTTPS)
const tree = dirtree(path.join(configs.dir, configs.name));

runLoop(tree, addRoute, app, configs );
app.get("*", (req, res) => res.send(ejs.renderFile(path.join(configs.dir, "404.html"), {req: req, res: res})));
return app;

	
}