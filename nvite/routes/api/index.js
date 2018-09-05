const router = require("express").Router();

const userInfo = require("./userInfo");
const imagePath = require("./imagePath");

router.use("/userInfo", userInfo);
router.use("/images", imagePath); //make the images show up

module.exports = router;
