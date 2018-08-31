
const db = require("../models");
// Defining methods for the nytController
// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
var fs = require('fs');


function awsCompareFaces(imageIn, imageServer) {

    var imageName = imageIn
    var image1 = fs.readFileSync(imageName);
    var imageName2 = imageServer
    var image2 = fs.readFileSync(imageName2);
    var faceDetection = new AWS.Rekognition({ region: 'us-east-1' });

    var param = {
        "SourceImage": {
            "Bytes": image1
        },
        "TargetImage": {
            "Bytes": image2
        }
    };

    console.log("Im in the aws method")
    var requestFace = faceDetection.compareFaces(param)
    var promiseFace = requestFace.promise();

    var imageResult = {
        Confidence: 0.0,
        Similarity: 0.0
    }
    return promiseFace.then(
        function (data) {
            console.log("im in the aws" + data);
            try {
                if (data.UnmatchedFaces.length > 0) {
                    imageResult.Similarity = 0.0
                    imageResult.Confidence = data.SourceImageFace.Confidence;
                    return imageResult;
                }
                else if (data.FaceMatches.length > 0){

                    imageResult.Confidence = data.SourceImageFace.Confidence;
                    imageResult.Similarity =  data.FaceMatches[0].Similarity;
                    return imageResult;
                }
            }catch(err){
                console.log(err);
                return imageResult;
            }
              
            }).catch(function(err){
                return err;
            })
}

// findAll searches the NYT API and returns only the entries we haven't already saved
module.exports = {
    postLoginInfoRequest: function (req, res) {
        let myRequest = req.body.imageEncoded;
        const imgFix1 = myRequest.replace(/data:image\/png;base64,/gi, "")
        let img1 = new Buffer(imgFix1, 'base64');
        username = Math.random();
        let imgComp1 = "./api/images/tempImage" + username + ".png"
        console.log("wtf");
        require('fs').writeFile(imgComp1, img1, function () {
            console.log('FILE SAVED AS : ' + imgComp1);

            //Get the username

            console.log(req.body.username);
            db.userRecord.findOne({ username: req.body.username }).then((data) => {
                console.log("im here" + data);
                var length = data.profileImages;
                var nLength = Object.keys(JSON.parse(JSON.stringify(length))[0]).length;
                // console.log(JSON.parse(JSON.stringify(length))[0]['img1'])
                console.log(nLength)
                var index = Math.floor(Math.random() * nLength + 1);
                console.log(index)
                imgComp2 = (JSON.parse(JSON.stringify(length))[0])['img' + index]
                console.log(imgComp2);

                awsCompareFaces(imgComp1, imgComp2)
                    .then(
                        (data) => {

                            console.log("Response Login", data);
                            if (data.Confidence > 70.0 && data.Similarity > 80.0) {
                                var ResponseLogin = {
                                    user: req.body.username,
                                    loginStatus: true
                                }
                               res.json(ResponseLogin)
                            }
                            else {
                                var ResponseLogin = {
                                    user: req.body.username,
                                    loginStatus: false
                                }
                             res.json(ResponseLogin)
                            }
                           
                        }
                    ).catch((err) => { 
                        console.log("error"+err) ;
                        var ResponseLogin = {
                            user: req.body.username,
                            loginStatus: false
                        }
                        res.json(ResponseLogin);
                    })
            }).catch(function(err){
                
                    var ResponseLogin = {
                        user: req.body.username,
                        loginStatus: false
                    }
                    res.json(ResponseLogin);
                
            })
         

        })



    }
};
