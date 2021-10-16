const { Op } = require("sequelize");
const db = require("../database");

exports.getFollows = async (req, res) => {
  const follows = await db.follows.findAll({
    where: { follower: req.body.user_name },
  });

  res.json(follows);
};

exports.createFollow = async (req, res) => {
  const follow = await db.follows.create({
    follower: req.body.follower,
    followed: req.body.followed,
  });

  res.json(follow);
};

exports.deleteFollow = async (req, res) => {
  await db.follows.destroy({
    where: {
      [Op.and]: [
        { follower: req.body.follower },
        { followed: req.body.followed },
      ],
    },
  });

  res.sendStatus(200);
};
