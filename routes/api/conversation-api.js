const router = require("express").Router();
const conversationController = require("../../controllers/conversationController");


// Matches with "/api/interests"
router.route("/")
  .get(conversationController.findAll)
  .post(conversationController.create);

router.route("/:id")
  .get(conversationController.findById)
  .post(conversationController.updateById);

  module.exports = router;