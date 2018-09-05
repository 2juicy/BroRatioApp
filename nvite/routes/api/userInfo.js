const router = require("express").Router();
const userInfoController = require("../../controller/userInfoController");
const userLoginController = require("../../controller/loginController");

router.route("/analyze").post(userInfoController.getPictureInfoRequest);

router.route("/loginAuth").post(userLoginController.postLoginInfoRequest);

router.route("/loginUserPass").post(userLoginController.postUserPassRequest);

module.exports = router;
