const router = require("express").Router();
const profileRoutes = require("./profile-api");
const interestsRoutes = require("./interests-api");
const favoritesRoutes = require("./favorites-api");
const userRoutes = require("./user-api")
const matchRoutes = require("./match-api")
const chatRoutes = require("./chat-api")


// profile routes
router.use("/profile", profileRoutes);

//interests routes
router.use("/interests", interestsRoutes);

// favorite routes
router.use("/favorites", favoritesRoutes);

//user routes
router.use("/user", userRoutes);

//
router.use("/match", matchRoutes)

router.use("/chat", chatRoutes)

module.exports = router;
