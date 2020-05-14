const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

// ****************************************************************************************
// GET all authors from the DB
// ****************************************************************************************

router.get('/users', (req, res) => {
  User.find() // <-- .find() method gives us always an ARRAY back
    .then(usersFromDB => res.render('users/list', { users: usersFromDB }))
    .catch(err => console.log(`Error while getting users from the DB: ${err}`));
});

// ****************************************************************************************
// GET details of a specific user (primarily their posts)
// ****************************************************************************************

router.get('/users/:userId/posts', (req, res) => {
  const { userId } = req.params;
  User.findById(userId) // <-- .findById() method gives us always an OBJECT back
    .populate('posts')
    .then(user => {
      // console.log('user: ', user);
      res.render('users/details', user);
    })
    .catch(err =>
      console.log(`Error while getting user details from the DB: ${err}`)
    );
});

module.exports = router;
