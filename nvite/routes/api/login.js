const router = require("express").Router();
const userLoginController = require("../../controller/loginController");

// Matches with "/api/imagePath"
router.route("/auth")
  .post(userLoginController.postLoginInfoRequest);

router
  .route("/:id")
  //.get(imgController.findById)

module.exports = router;
