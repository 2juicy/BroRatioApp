import Dropzone from "react-dropzone";
import React from "react";
import  {post}  from "superagent";
import { Paper, Input, InputAdornment, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Visibility from "@material-ui/icons/Visibility";

export default class Basic extends React.Component {
  constructor() {
    super();
    this.state = {
      files: [],
      user: "",
      password: "",
      num: 1,
      warningState: ""
    };

  }



  onDrop(files) {
    var tmp =[]
    tmp = this.state.files.slice() //immutability biiitch
    
    files.forEach( (elemet) => {
      tmp.push(elemet)
    })
  
    this.setState(
      {files:tmp}
     );
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  onUploadClick() {
    if (this.state.files.length > 2) {
      this.setState({
        warningState: ""
      });
      const req = post("/api/login/signAuth");
      var userData = {
        user: this.state.user,
        password: this.state.password
      };
      var uploadOG = "😬 U-p-l-o-a-d-i-n-g 😬";

      this.state.files.forEach(file => {
        uploadOG = uploadOG;
        req.attach("image" + this.state.num, file);
        this.setState({ num: this.state.num + 1, warningState: uploadOG });
      });
      req.field(userData); //Send the user info
      req
        .then(data => {
          console.log(data);
          var uploadOGDone = "😬DONEEEEEEEEEE with the Upload/SignUP 😬 ";
          this.setState({ warningState: uploadOGDone });
        })
        .catch(data => {
          console.log(data);
          this.setState({ warningState: "Error Something Went wrong check Console" });
        });
    } else {
      this.setState({
        warningState:
          "😬😬😬😬😬😬😬😬😬😬Not Enough Pictures are uploaded, cant sign - up 😬😬😬😬😬😬😬😬😬😬😬😬"
      });
    }
  }

  render() {
    return (
      <div
        className="container"
        style={{ color: "white", textAlign: "center" }}
      >
        <h1 className="nvite">Welcome to Nvite...</h1>
        <div style={{ width: "100%",textAlign: "center" }}>
          <Dropzone accept="image/jpeg, image/png" onDrop={this.onDrop.bind(this)} disablePreview={false} multiple={true}
          style={{position: "relative", textAlign: "center" , width: "70%", height: "70%", borderWidth: "10px",margin:"0 auto",borderColor: "white", borderStyle: "dashed", borderRadius: "5px"}}
          >
            <p style={{ color: "white" , backgroundColor:"#11ece2c4" }}>         
            <img src="https://png.icons8.com/metro/1600/dropbox.png" width="30%" height="200px" textAlign="center"/>
            <p style={{ color: "white" , backgroundColor:"black" }} > 
                      🤘Try dropping some png or jpeg here 🤘, or click to select files to upload.👉🏻 👉🏻  
           </p>
                  ￼
            </p>
       

          </Dropzone>
        </div>
        <section style={{ color: "white", textAlign: "center" }}>
          <aside style={{ color: "white" }}>
            <h2>{this.state.warningState}</h2>
            <h2 className="mood">
              We recommend up to 😃 😃 😃 😃 😃 (5 face)pictures if available
            </h2>
            <ul style={{ listStyle: "none" }}>
              {this.state.files.map(f => (
                <li key={f.name}>
                  {f.name} - {f.size} bytes
                </li>
              ))}
            </ul>
          </aside>
        </section>
        <Paper style={{ width: "250px", margin: "auto" }}>
          <Input
            placeholder="Username"
            name="user"
            value={this.state.user}
            onChange={this.handleInputChange}
            type="text"
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
          />
          <br />
          <Input
            style={{ marginBottom: "5px" }}
            color="secondary"
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
            type="password"
            startAdornment={
              <InputAdornment position="start">
                <Visibility />
              </InputAdornment>
            }
          />
        </Paper>
        <br />
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={this.onUploadClick.bind(this)}
        >
          Sign Up
        </Button>
        <br />
        <Button
          color="secondary"
          variant="contained"
          href="./"
          style={{ marginTop: "10px" }}
        >
          Return to Login
        </Button>
      </div>
    );
  }
}

<Basic />;
