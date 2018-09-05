import React, { Component } from "react";
import { Input, InputAdornment, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Visibility from "@material-ui/icons/Visibility";
import axios from "axios";
const styles = {
  width: "auto"
};

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      password: "",
      message:""
    };
  }

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.state.user && this.state.password) {
      console.log(`Testing: ${this.state.user} ${this.state.password}`);
      this.setState({
        user: "",
        password: ""
      });
      axios
      .post("./api/userInfo/loginUserPass", {
        username: this.state.user,
        password: this.state.password
      }).then((resdata)=>{
        console.log(resdata.data)
       if(resdata.data.loginStatus == true){
        localStorage.setItem("broLogin", JSON.stringify(resdata.data));
        window.location.reload();
       }
       else{
        this.setState({message:"Wrong Password or Username on your attempt......try again"});
       }   
      }).catch(()=>{
        this.setState({message:"Wrong Password or Username on your attempt.......try again"});
      })
    }
  };


  render() {
    return (
      <div style={styles}>
        <form>
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
          <Input
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
          <br />
          <Button
            variant="contained"
            type="submit"
            onClick={this.handleFormSubmit}
          >
            Submit
          </Button>
        </form>
        <p className="message">{this.state.message}</p>
      </div>
    );
  }
}
