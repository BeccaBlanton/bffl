const router = require("express").Router();
const chatController = require("../../controllers/chatController");


// Matches with "/api/interests"
router.route("/")
  .get(chatController.findAll)
  .post(chatController.create);

router.route("/:id")
  .get(chatController.findById)
  .post(chatController.updateById);

  module.exports = router;