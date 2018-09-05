import React from "react";
import Webcam from "react-webcam";
// Material-UI imports
import { InputAdornment, Paper, Input, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import axios from "axios";
import { Redirect } from "react-router-dom";
// Component imports
import SimpleModal from "../SimpleModal/SimpleModal";

const styles = {
  width: "auto",
  textAlign: "center"
};

//Extended
class StartCam extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      message: ""
    };
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  setRef = webcam => {
    this.webcam = webcam;
  };

  signUp() {
    return <Redirect to="./signup" />;
  }
  capture = e => {
    e.preventDefault();
    const imageSrc = this.webcam.getScreenshot();
    //Post request happens to send a image and a user password, we get response indicating if
    //the login was a success
    this.setState({ image: imageSrc, message: "Logging in..." });
    //console.log(imageSrc, this.state.username);

    axios
      .post("./api/userInfo/loginAuth", {
        imageEncoded: imageSrc,
        username: this.state.username
      })
      .then(response => {
        // this.setState({ results: response });
        // console.log(this.state.results);
        console.log(response.data);
        localStorage.setItem("broLogin", JSON.stringify(response.data));
        if (response.data.loginStatus === false) {
          this.setState({
            message: "Login fail. Try logging in with your username."
          });
        } else {
          window.location.reload();
        }
      });
  };

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <div style={styles}>
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
        <p className="message">{this.state.fail}</p>

        <form>
          <Paper style={{ width: "250px", height: "auto", margin: "auto" }}>
            <Input
              style={{ marginBottom: "5px" }}
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              type="password"
              startAdornment={
                <InputAdornment
                  position="start"
                  style={{ marginRight: "15px" }}
                >
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </Paper>
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="primary"
            onClick={this.capture}
            style={{ margin: "5px 0 5px 0" }}
          >
            Login With Picture
          </Button>
        </form>
        <p className="message">{this.state.message}</p>
        <br />
        <div style={{ display: "inline-block" }}>
          <Button
            color="secondary"
            size="large"
            variant="contained"
            href="./signup"
          >
            Sign Up
          </Button>
          <SimpleModal />
        </div>
      </div>
    );
  }
}
export default StartCam;
