const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const Post = require('../models/Post.model');

// ****************************************************************************************
// GET - to display the form to create a new post
// ****************************************************************************************

// localhost:3000/post-create
router.get('/post-create', (req, res) => {
  User.find()
    .then(dbUsers => {
      res.render('posts/create', { dbUsers });
    })
    .catch(err => console.log(`Err while displaying post input page: ${err}`));
});

// ****************************************************************************************
// POST - create a post
// ****************************************************************************************

// <form action="/posts" method="POST">
router.post('/posts', (req, res) => {
  const { title, content, author } = req.body;
  Post.create({ title, content, author })
    .then(dbPost => {
      User.findById(author)
        .then(dbUser => {
          dbUser.posts.push(dbPost._id);
          dbUser
            .save()
            .then(() => res.redirect('/posts'))
            .catch(`Err while adding the post to user's posts: ${err}`);
        })
        .catch(err => `Err while getting the user  from  the database: ${err}`);
    })
    .catch(err => console.log(`Err while saving the post in the DB: ${err}`));
});

// ****************************************************************************************
// GET route to display all the posts
// ****************************************************************************************

router.get('/posts', (req, res) => {
  Post.find()
    .populate('author') // .populate("author") --> we are saying: give me all the details related to the 'author' field in the post
    //                      (there's only author id there so what it does is-finds the rest of information related to that author based on the id)
    .then(dbPosts => res.render('posts/list', { posts: dbPosts }))
    .catch(err => console.log(`Err while getting the posts from the DB: ${err}`));
});

// ****************************************************************************************
// GET route for displaying the post details page
// shows how to deep populate (populate the populated field)
// ****************************************************************************************

router.get('/posts/:postId', (req, res) => {
  const { postId } = req.params;
  Post.findById(postId)
    .populate('author comments') // <-- the same as .populate('author).populate('comments')
    .populate({
      // we are populating author in previously populated comments
      path: 'comments',
      populate: {
        path: 'author',
        model: 'User'
      }
    })
    .then(foundPost => res.render('posts/details', foundPost))
    .catch(err => console.log(`Err while getting the specific post from the  DB: ${err}`));
});

module.exports = router;
