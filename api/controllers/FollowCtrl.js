const { Follow, User, Sequelize } = require("../models");
const { Op } = require("sequelize");

const FollowController = {
  follow: async (req, res) => {
    try {
      const { userIdToFollow } = req.body;
      const userId = req.user.id;

      if (userId === userIdToFollow) {
        return res.status(400).json({ error: "You cannot follow yourself" });
      }

      // Check if the user to follow exists
      const userToFollow = await User.findOne({
        where: { id: userIdToFollow },
      });
      console.log(
        "🚀 ~ file: FollowCtrl.js:18 ~ follow: ~ userToFollow:",
        userToFollow
      );

      if (!userToFollow) {
        return res.status(400).json({ error: "User to follow does not exist" });
      }

      const existingFollow = await Follow.findOne({
        where: {
          user_id: userId,
          friends_id: userIdToFollow,
        },
      });

      if (existingFollow) {
        return res
          .status(400)
          .json({ error: "You are already following this user" });
      }

      const follow = await Follow.create({
        user_id: userId,
        friends_id: userIdToFollow,
        created_by: req.user.id,
        created_at: Sequelize.literal("CURRENT_TIMESTAMP"),
      });

      return res.status(200).json(follow);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while following the user" });
    }
  },
};

module.exports = FollowController;
