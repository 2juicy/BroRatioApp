const db = require("../models");

// Load the SDK and UUID
var AWS = require("aws-sdk");
var uuid = require("uuid");
var fs = require("fs");

var collectionOfBuckets;

//Buckets access service
function awsGetBucketList() {
  var s3 = new AWS.S3();
  var params = {};
  var request = s3.listBuckets(params);
  var promise = request.promise();

  // handle promise's fulfilled/rejected states
  promise.then(
    function(data) {
      /* process the data */
      //console.log(data);
      console.log(data);
    },
    function(error) {
      console.log(error);
    }
  );
}

//Internal functions
function awsGetFaceStats(imageName, DEBUG = false) {
  //for AWS detection
  var image1 = fs.readFileSync(imageName);
  var faceDetection = new AWS.Rekognition({ region: "us-east-1" });

  var param = {
    Image: {
      Bytes: image1
    },
    Attributes: ["ALL"]
  };

  var requestFace = faceDetection.detectFaces(param);
  var promiseFace = requestFace.promise();

  var returnFaceObject = {
    malesObject: "",
    maleCount: "",
    maleHappy: "",
    maleMoodOther: "",

    femalesObject: "",
    femaleCount: "",
    femaleHappy: "",
    femaleMoodOther: ""
  };
  return promiseFace.then(
    function(data) {
      //var parsed = JSON.stringify(data,null,4);

      var males = data.FaceDetails.filter(x => x.Gender.Value === "Male"); //If they have a beard
      var maleHappyCount = males.filter(x =>
        x.Emotions.find(xs => xs.Type == "HAPPY" && xs.Confidence >= 60.0)
      );
      var maleSadCount = males.filter(x =>
        x.Emotions.find(xs => xs.Type != "HAPPY")
      );

      var females = data.FaceDetails.filter(x => x.Gender.Value === "Female"); //If they have a beard
      var femaleHappyCount = females.filter(x =>
        x.Emotions.find(xs => xs.Type == "HAPPY" || xs.Confidence >= 60.0)
      );
      var femaleSadCount = females.filter(x =>
        x.Emotions.find(xs => xs.Type != "HAPPY")
      );

      //Male Information
      returnFaceObject.malesObject = males;
      returnFaceObject.maleCount = males.length;
      returnFaceObject.maleHappy = maleHappyCount.length;
      returnFaceObject.maleMoodOther = maleSadCount.length;

      //Female Information
      returnFaceObject.femalesObject = females;
      returnFaceObject.femaleCount = females.length;
      returnFaceObject.femaleHappy = femaleHappyCount.length;
      returnFaceObject.femaleMoodOther = femaleSadCount.length;

      //console.log(returnFaceObject);

      if (DEBUG) {
        console.log(
          "|---------------------DEBUG Start-------------------------|"
        );
        console.log(
          "|--------------------DEBUG Male--------------------------|"
        );
        console.log("Male Count :" + males.length);
        console.log("Fe Happy Count : " + maleHappyCount.length);
        console.log(
          "Fe Sad or angry or confused Count : " + maleSadCount.length
        );
        console.log(
          "|---------------------DEBUG Female-------------------------|"
        );
        console.log("FeMale Count :" + females.length);
        console.log("Fe Happy Count : " + femaleHappyCount.length);
        console.log(
          "Fe Sad or angry or confused Count : " + +femaleSadCount.length
        );
        console.log(
          "|---------------------DEBUG End-------------------------|"
        );
      }
      return returnFaceObject;
    },
    function(error) {
      console.log(error);
    }
  );
}

//Public function
function getPictureInfo(imageName) {
  let result;
  return awsGetFaceStats(imageName).then(function(resultIN) {
    result = resultIN;
    //console.log(result);
    return result;
  });
}

// Defining methods for the articleController
module.exports = {
  getPictureInfoRequest: function(req, res) {
    let myRequest = req.body.imageEncoded;
    const imgFix1 = myRequest.replace(/data:image\/png;base64,/gi, "");
    let img1 = new Buffer(imgFix1, "base64");
    let username = "user-" + req.body.username;
    let imgeName = "./api/images/imageMain" + username + ".png";
    console.log("wtf");
    require("fs").writeFile(imgeName, img1, function() {
      console.log("FILE SAVED AS : " + imgeName);
      getPictureInfo(imgeName).then(function(data) {
        console.log(data);
        res.json(data);
      });
    });
  }
};
