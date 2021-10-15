const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database
exports.all = async (req, res) => {
    const users = await db.user.findAll();

    res.json(users);
};

// Select one user from the database
exports.one = async (req, res) => {
    const user = await db.user.findByPk(req.params.username);
    res.json(user);
};

// Select one user from the database if username and password match
exports.login = async (req, res) => {
    const user = await db.user.findByPk(req.query.username);

    if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
        // Login failed
        res.json(null);
    else    
        res.json(user);
};

// Create a user in the database
exports.create = async (req, res) => {
    const hash = await argon2.hash(req.body.password, { type: argon2.argon2id});

    const user = await db.user.create({
        user_name: req.body.username,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        password_hash: hash,
    });

    res.json(user);
}

// Updates user via primary key user_name
exports.updateUser = async (req, res) => {
    const user = await db.user.findByPk(req.body.username);

    const hash = await argon2.hash(req.body.password, {type: argon2.argon2id});
    
    user.user_name = req.body.username;
    user.first_name = req.body.firstname;
    user.last_name = req.body.lastname;
    user.email = req.body.email;
    user.password_hash = hash;

    await user.save();

    res.json(user);
}

exports.deleteUser = async (req,res) => {
    await db.posts.destroy({where: {user_name: req.body.user_name}});
    await db.liked_posts.destroy({where: {liked_by: req.body.user_name}});
    await db.follows.destroy({where: {follower: req.body.user_name}});
    await db.follows.destroy({where: {followed: req.body.user_name}});
    await db.user.destroy({where: {user_name: req.body.user_name}});

    res.sendStatus(200);
}