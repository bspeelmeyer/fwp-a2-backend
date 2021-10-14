const db = require("../database");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public'),
    filename: function (req,file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage: storage}).single('post-image');


exports.uploadImage = async (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.json(err);
        }
        res.send(req.file.filename);
    })
}
// Create post in database
exports.create = async (req, res) => {
    const post = await db.posts.create({
        post_content: req.body.post_content,
        user_name: req.body.user_name,
        user_id: req.body.user_id,
        image: req.body.image,

    });
    res.json(post);
}

// Get all posts
exports.all = async (req, res) => {
    const posts = await db.posts.findAll({where: {parent_post_id: null}});

    res.json(posts);
}