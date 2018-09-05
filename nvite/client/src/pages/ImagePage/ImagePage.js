import React, { Component, Fragment } from "react";
import LoginBar from "../../components/LoginBar/LoginBar";
import ImageList from "../../components/ImageList/ImageList";

export default class ImagePage extends Component {
  render() {
    return (
      <Fragment>
        <LoginBar />
        <ImageList />
      </Fragment>
    );
  }
}
