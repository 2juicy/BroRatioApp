import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// Material-UI Imports
import {
  GridList,
  GridListTile,
  IconButton,
  GridListTileBar,
  ListSubheader
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// Image Imports
import tileData from "./tileData";

const styles = theme => ({
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
});

function TitlebarGridList(props) {
  const { classes } = props;
  let item;
  if (localStorage.getItem("broLogin") == null) {
    item = false;
  } else {
    item = JSON.parse(localStorage.getItem("broLogin")).loginStatus;
  }

  if (item == false) {
    return (
      <Fragment>
        <GridList col={3} cellHeight={400}>
          {tileData.map(tile => (
            <GridListTile key={tile.img}>
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.author}</span>}
              />
            </GridListTile>
          ))}
        </GridList>
      </Fragment>
    );
  } else {
    for (let index = 0; index < 5; index++) {
      tileData[index].img =
        "/images/" +
        (index + 1) +
        JSON.parse(localStorage.getItem("broLogin")).user +
        ".png";
      tileData[index].author = JSON.parse(
        localStorage.getItem("broLogin")
      ).user;
    }
    return (
      <Fragment>
        <GridList col={3} cellHeight={400}>
          {tileData.map(tile => (
            <GridListTile key={tile.img}>
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.author}</span>}
              />
            </GridListTile>
          ))}
        </GridList>
      </Fragment>
    );
  }
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
