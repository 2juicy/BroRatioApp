const router = require("express").Router();
const path = require("path");

module.exports = app => {
  //This is needed to serve the images
  app.get("/images/:id", function(req, res) {
    var name = req.params.id;
    console.log(name);
    var npath = path.join(__dirname, "../../api/images/" + name);
    res.sendFile(npath);
  });
};
