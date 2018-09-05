import React from "react";
import { Redirect } from "react-router";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
// Material-UI imports
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { deepOrange, indigo } from "@material-ui/core/colors";
// Page Imports
import Landing from "./pages/Landing/Landing";
import Uploader from "./pages/Uploader/dropzone";
import Start from "./pages/Start/Start";
import ImagePage from "./pages/ImagePage/ImagePage";

const theme = createMuiTheme({
  palette: {
    primary: { main: deepOrange[500] },
    secondary: { main: indigo[400] }
  }
});

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={props => {
                let item;

                if (localStorage.getItem("broLogin") == null) {
                  item = false;
                } else {
                  item = JSON.parse(localStorage.getItem("broLogin"))
                    .loginStatus;
                }

                if (item === true) return <Redirect to="/landing" />;
                else return <Start />;
              }}
            />
            <Route
              exact
              path="/landing"
              render={props => {
                let item;
                if (localStorage.getItem("broLogin") == null) {
                  item = false;
                } else {
                  item = JSON.parse(localStorage.getItem("broLogin"))
                    .loginStatus;
                }

                if (item === false) return <Redirect to="/" />;
                else return <Landing />;
              }}
            />
            <Route
              exact
              path="/images"
              render={props => {
                let item;
                if (localStorage.getItem("broLogin") == null) {
                  item = false;
                } else {
                  item = JSON.parse(localStorage.getItem("broLogin"))
                    .loginStatus;
                }

                if (item === false) return <Redirect to="/" />;
                else return <ImagePage />;
              }}
            />
            <Route
              exact
              path="/signup"
              render={props => {
                let item;

                if (localStorage.getItem("broLogin") == null) {
                  item = false;
                } else {
                  item = JSON.parse(localStorage.getItem("broLogin"))
                    .loginStatus;
                }
                if (item === true) return <Redirect to="/landing" />;
                else return <Uploader />;
              }}
            />
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
