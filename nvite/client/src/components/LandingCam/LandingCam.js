import React from "react";
import Webcam from "react-webcam";
// Material-UI imports
import Button from "@material-ui/core/Button";
import axios from "axios";
import "./Camera.css";
import { image } from "../../../node_modules/superagent/lib/node/parsers";

// 
class MoodRow extends React.Component {
  render() {
    const mood = this.props.mood;
    const percentage = this.props.percentage;
    return (
      <tr>
        <td>{mood}</td>
        <td>{percentage}</td>
      </tr>

    );
  }
}



//Extended
class WebcamCapture extends React.Component {
  state = {
    disable: false,
    male: 0,
    female: 0,
    mood: null,
    message: null,
    ageLow: "",
    ageHigh: "",
    url: "",
    maleObject: [],
    femaleObject: []
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  moodTranslater = moodText => {
    var returnemoji = "😈"
    switch (moodText) {
      case "HAPPY":
        returnemoji = "😆 " + moodText
        break;

      case "SAD":
        returnemoji = "😔 " + moodText
        break;

      case "ANGRY":
        returnemoji = "😤 " + moodText
        break;

      case "CONFUSED":
        returnemoji = "🤔 "+ moodText
        break;

      case "DISGUSTED":
        returnemoji = "😩 "+ moodText
        break;

      case "SURPRISED":
        returnemoji = "😜 "+ moodText
        break;

      case "CALM":
        returnemoji = "😏 "+ moodText
        break;

      case "UNKNOWN":
        returnemoji = "👽"
        break;

    }
    return returnemoji;
  }


  maleCountGraph = () => {
    // var MCount = this.state.maleCount;
    // var objects =  this.state.maleObject;
    var maleEmoji1 = " 👨‍ ";
    var maleEmoCounter = "";
    var manVar = this.state.male == 1 ? "Man" : "Men";

    for (var i = 0; i < this.state.male; i++) {
      maleEmoCounter = maleEmoCounter + maleEmoji1;
    }
    const rowsMain = [];
    var maleCount = 1;
    this.state.maleObject.forEach(element => {
      const rows = [];
      element.Emotions.forEach(element1 => {
        rows.push(<MoodRow mood={this.moodTranslater(element1.Type)} percentage={Math.floor(element1.Confidence) + "%"} />)
      })
    rowsMain.push(<div><p>{manVar}[{maleCount}] = Age ({element.AgeRange.Low}-{element.AgeRange.High})</p> {rows}</div>)
      maleCount++;
    })
    //console.log("Male DEBUG",this.state.maleObject)

    return (
      <div>
        <p>
          <li>{this.state.male} {manVar} {maleEmoCounter}</li>
        </p>
        <table style={{ textAlign: "center", margin: "2% auto" }}>
          {rowsMain}
        </table>

      </div>
    )
  };



  femaleCountGraph = () => {

    var femaleEmoji1 = " 👩 ";
    var femaleEmoCounter = "";
    var womanVar = this.state.female == 1 ? "Woman" : "Women";

    for (var i = 0; i < this.state.female; i++) {
      femaleEmoCounter = femaleEmoCounter + femaleEmoji1;
    }
    console.log(this.state.femaleObject)
    const rowsMain = [];
    var femaleCount = 1;
    this.state.femaleObject.forEach(element => {
      const rows = [];
      element.Emotions.forEach(element1 => {
        rows.push(<MoodRow mood={this.moodTranslater(element1.Type)} percentage={Math.floor(element1.Confidence) + "%"} />)
      })


      rowsMain.push(<div><p>{womanVar}[{femaleCount}] = Age ({element.AgeRange.Low}- {element.AgeRange.High}) </p> {rows}</div>)
      femaleCount++;
    })
    //console.log("Male DEBUG",this.state.maleObject)

    return (
      <div>
        <p>
          {
            <li>{this.state.female} {womanVar} {femaleEmoCounter}</li>
          }
        </p>
        <table style={{ textAlign: "center", margin: "2% auto" }}>
          {rowsMain}
        </table>

      </div>
    )
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      message: "Analyzing photo...",
      disable: true,
      male: 0,
      female: 0,
      fmood: null,
      mmood: null,
      mageLow: 0,
      mageHigh: 0,
      fageLow: 0,
      fageHigh: 0
    });
    setTimeout(() => {
      this.setState({
        disable: false,
        message: "Take another photo!"
      });
    }, 9999);
    // console.log(imageSrc);
     var curUser = JSON.parse(localStorage.getItem("broLogin")).user;
    axios
      .post("./api/userInfo/analyze", { imageEncoded: imageSrc , username:curUser})
      .then(response => {
        console.log(response.data)
        this.setState({
          disable: false,
          male: response.data.maleCount ? response.data.maleCount : 0,
          female: response.data.femaleCount ? response.data.femaleCount : 0,
          message: "Analysis complete! Take another photo...",
          femaleObject: response.data.femalesObject ? response.data.femalesObject : [],
          maleObject: response.data.malesObject ? response.data.malesObject : []
        });

        if (response.data.maleCount > 0 || response.data.femaleCount > 0)
          if (response.data.malesObject.length > 0 || response.data.femalesObject.length > 0) {
            try {
              //Get the male info
              var malesAgeLow = "Not Detected"
              var malesAgeHigh = "Not Detected"
              var malesMood = "Not Detected"

              //Get femal info
              var femalesAgeLow = "Not Detected"
              var femalesAgeHigh = "Not Detected"
              var femalesMood = "Not Detected"


              var maleDetect = response.data.malesObject.length > 0 ? true : false;
              var femaleDetect = response.data.femalesObject.length > 0 ? true : false;

              if (maleDetect) {
                malesAgeLow = "";
                malesAgeHigh = "";
                malesMood = "";
                var counter = 1;
                response.data.malesObject.forEach(element => {

                  malesAgeLow += "Male[" + counter + "] Low" + element.AgeRange.Low + " ";
                  malesAgeHigh += "Male[" + counter + "] High" + element.AgeRange.High + " ";
                  malesMood += "*****Male[" + counter + "] " + JSON.stringify(element.Emotions) + "******";
                  counter = counter + 1;
                })
              }

              var femaleArray;
              if (femaleDetect) {
                femaleArray = [];

                femalesAgeLow = "";
                femalesAgeHigh = "";
                femalesMood = "";
                console.log(response.data.femalesObject);
                var counter = 1;
                response.data.femalesObject.forEach(element => {

                  femalesAgeLow += "FMale[" + counter + "] Low" + element.AgeRange.Low + " ";
                  femalesAgeHigh += "FMale[" + counter + "] High" + element.AgeRange.High + " ";
                  femalesMood += "*******FMale[" + counter + "] " + JSON.stringify(element.Emotions) + "******";
                  counter = counter + 1;
                })
              }


              this.setState({
                mageLow: malesAgeLow,
                fageLow: femalesAgeLow,
                mageHigh: malesAgeHigh,
                fageHigh: femalesAgeHigh,
                mmood: malesMood,
                fmood: femalesMood,
                url: "/images/imageMainuser-"+curUser+".png?" + Date.toString()
              });
              var c = document.getElementById("canvas");
              var ctx = c.getContext("2d");
              ctx.rect(20, 20, 150, 100);
              ctx.stroke();
            } catch (err) {
              console.log(err);
            }
          }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  componentDidMount() {
    this.setState({
      url: "./images/noimage.jpg"
    });
  }
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };



    return (
      <div>
        <Webcam
          audio={false}
          height={470}
          ref={this.setRef}
          screenshotFormat="image/png"
          width={"100%"}
          style={{ borderRadius: "800px" }}
          videoConstraints={videoConstraints}
          gutterBottom
        />
        <br />
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={this.capture}
          disabled={this.state.disable}
        >
          Capture photo
        </Button>
        <div className="container">
          <p className="message">{this.state.message}</p>
          <div
            style={{ height: "70%", width: "70%", display: "inline-block" }}
          >
            <img
              style={{
                overflow: "hidden",
                width: "100%",
                height: "100%",
                borderRadius: "30px"
              }}
              src={this.state.url + "?" + new Date().getTime()}
              alt="No Results!"
            />
          </div>

          <div className="score" style={{ border: "1px solid red", backgroundImage:'url("/images/WoodBack.jpg")',opacity:".92"}}>
            {
              (this.state.male > 0) ? (
                <span >
                  <div>{this.maleCountGraph()}</div>
                </span>

              ) : (<span></span>)
            }
            {
              (this.state.female > 0) ? (
                <span>
                  <div>{this.femaleCountGraph()}</div>
                </span>
              ) : (<span></span>)
            }

          </div>
        </div>
      </div>
    );
  }
}
export default WebcamCapture;
