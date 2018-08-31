import React from "react";
import Webcam from "react-webcam";
// Material-UI imports
import Button from "@material-ui/core/Button";
import axios from "axios";
import "./Camera.css";

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
    url: ""
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      message: "Analyzing photo...",
      disable: true,
      male: 0,
      female: 0,
      mood: null,
      ageLow: 0,
      ageHigh: 0
    });
    setTimeout(() => {
      this.setState({
        disable: false,
        message: "Take another photo!"
      });
    }, 9999);
    // console.log(imageSrc);
    axios
      .post("./api/userInfo/analyze", { imageEncoded: imageSrc })
      .then(response => {
        this.setState({
          disable: false,
          male: response.data.maleCount ? response.data.maleCount: 0,
          female: response.data.femaleCount ? response.data.femaleCount:0,
          message: "Analysis complete! Take another photo..."
        });

        if(response.data.maleCount > 0 ||response.data.femaleCount > 0 )
        if (response.data.malesObject.length > 0 || response.data.femaleObject.length > 0 ) {
          try {
            //Get the male info
            var malesAgeLow = "Not Detected"
            var malesAgeHigh = "Not Detected"
            var malesMood = "Not Detected"
          
            //Get femal info
            var femalesAgeLow = "Not Detected"
            var femalesAgeHigh = "Not Detected"
            var femalesMood = "Not Detected"
          
            //
            var maleDetect = response.data.malesObject.length > 0 ? true: false;
            var femaleDetect = response.data.femalesObject.length > 0 ? true: false;

            if(maleDetect)
            {
              malesAgeLow = "";
              malesAgeHigh = "";
              malesMood = "";
              var counter = 0;
              response.data.malesObject.forEach(element=>{
                malesAgeLow += element.AgeRange.Low + " ";
                malesAgeHigh += element.AgeRange.High + " ";
                malesMood += JSON.stringify(element.Emotions) + " ";
              })        
            }


            if(femaleDetect)
            {
              femalesAgeLow = "";
              femalesAgeHigh = "";
              femalesMood = "";
              response.data.femalesObject.forEach(element=>{
                femalesAgeLow += element.AgeRange.Low + " ";
                femalesAgeHigh += element.AgeRange.High + " ";
                femalesMood += JSON.stringify(element.Emotions) + " ";
              })
            }


            this.setState({
              ageLow: " Males " +  malesAgeLow   
                      +" Females " + femalesAgeHigh  ,
              ageHigh: " Male " + malesAgeHigh 
                      +" Female " +  femalesAgeHigh 
              
              ,
              mood: " Males "+ malesMood 
                    +" Females " +femalesMood ,
              url: "/images/imageMainuser-random.png?" + Date.toString()
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
      .catch(function(error) {
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
          width={600}
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
            style={{ height: "337px", width: "600px", display: "inline-block" }}
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
          <p className="score">
            <span>Male: {this.state.male}</span>
            <span>|</span>
            <span>Female: {this.state.female}</span>
          </p>
          <br></br>
          <p className="mood">Mood: {this.state.mood}</p><br></br><br></br>
          <p className="age">
            <span>Age Range: {this.state.ageLow}</span>
            <span> - </span>
            <span>{this.state.ageHigh}</span>
          </p>
        </div>
      </div>
    );
  }
}
export default WebcamCapture;
