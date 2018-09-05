const router = require("express").Router();
const userLoginController = require("../../controller/loginController");

router.route("/auth").post(userLoginController.postLoginInfoRequest);

router.route("/:id");
//.get(imgController.findById)

module.exports = router;
