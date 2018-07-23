const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
const fileUpload = require('express-fileupload');
const cors = require('cors');
const busboy = require('connect-busboy');
const db = require("./models");


// Set up promises with mongoose
mongoose.Promise = global.Promise;

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/brotioDB"
);

app.use(cors());
app.use(fileUpload());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Configure body parser for AJAX requests
app.use(bodyParser.json({ limit: '50mb', extended: true }));

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


app.post('/api/login/signAuth', (req, res, next) => {
  console.log("db(entry)-recieved");
  //console.log(JSON.stringify(req.body));
  var username = req.body.user;
  var password = req.body.password;
  console.log(req.files);
  var img1 = req.files['image1'];
  if (img1 != null) {
    console.log(img1);
    var num = 0;
    var listOfLocations = [];
    img1.forEach(element => {
      let imgeName1 = "./api/images/" + (++num) + username + ".png";
      listOfLocations.push(imgeName1);
      console.log("wtf-SAVER-cus-ITS-cool");
      require('fs').writeFile(imgeName1, element.data, function () {
        console.log('FILE SAVED AS : ' + imgeName1);
      })
    });

    var userRecordObject = {
      username: username,
      password: password
    };
    
    db.userRecord.create(userRecordObject).then(function (dbAdd) {
      // View the added result in the console
      console.log(dbAdd);
      var imageArr = {
        img1: typeof listOfLocations[0] != "undefined" ? listOfLocations[0] : "./api/images/def.png",
        img2: typeof listOfLocations[1] != "undefined" ? listOfLocations[1] : "./api/images/def.png",
        img3: typeof listOfLocations[2] != "undefined" ? listOfLocations[2] : "./api/images/def.png",
        img4: typeof listOfLocations[3] != "undefined" ? listOfLocations[3] : "./api/images/def.png",
        img5: typeof listOfLocations[4] != "undefined" ? listOfLocations[4] : "./api/images/def.png",
      }
      db.userMeta.create(imageArr)
        .then(function (dbMatches) {
          // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
          // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
          // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
          db.userRecord.findOneAndUpdate({ username: userRecordObject.username }, { userMeta: dbMatches._id }, { new: true });
        })
        .populate("userMeta")
        .then(function (dbrecord) {
          // If we were able to successfully update an Article, send it back to the client
          return res.json(dbrecord);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    })
      .catch(function (err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });

  }
})

app.get("/populated", function(req, res) {
  // Using our Library model, "find" every library in our db and populate them with any associated books
  db.userRecord.find({})
    // Specify that we want to populate the retrieved libraries with any associated books
    .populate("userMetas")
    .then(function(dbLibrary) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbLibrary);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


require("./routes/api/imagePath.js")(app);
app.use(routes);



// Start the API server
app.listen(PORT, () =>
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
);
