const sha256 = require('sha256');
const config = require('../config');
const mailTemplates = require('../mailtemplates');
const mailgun = require('mailgun-js')(config.MAILGUN);
const { getDate, generateToken } = require('../utilities');
const jwt = require('jsonwebtoken');

const getAllUsers = (req, res, next, db) => {
  db
    .any('SELECT * FROM users ORDER BY id')
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

const login = (req, res, next, db) => {
  db
    .any('SELECT id, password, name FROM users WHERE email = $1', [
      req.body.email
    ])
    .then(function(data) {
      if (!data.length) {
        res.status(200).json({ error: 'User not found' });
        return next();
      }

      if (req.body.password === data[0].password) {
        const token = sha256(
          Math.round(
            new Date().getMilliseconds() * Math.random() * 10000000000000
          ).toString()
        );
        const { id, name } = data[0];
        db
          .any('UPDATE users SET token = $2, lastLogin = $3 WHERE email = $1', [
            req.body.email,
            token,
            getDate()
          ])
          .then(function(data) {
            jwt.sign({ id }, config.AUTH_SECRET_KEY, (err, jwt) => {
              res.json({ id, name, token, success: true, jwt });
            });
          });
      } else {
        res.status(200).json({ error: 'Wrong password' });
      }
    })
    .catch(function(err) {
      return next(err);
    });
};

const loginJWT = (req, res, next, db) => {
  db
    .any('SELECT id, password, name FROM users WHERE email = $1', [
      req.body.email
    ])
    .then(function(data) {
      console.log(data);
      if (!data.length) {
        res.json({ error: 'User not found' });
      }

      if (req.body.password === data[0].password) {
        const { id, name } = data[0];
        db
          .any('UPDATE users SET lastLogin = $1 WHERE email = $2', [
            getDate(),
            req.body.email
          ])
          .then(function(data) {
            jwt.sign({ id }, config.AUTH_SECRET_KEY, (err, token) => {
              res.json({ name, token });
            });
          });
      } else {
        res.status(200).json({ error: 'Wrong password' });
      }
    })
    .catch(function(err) {
      return next(err);
    });
};

const verifyToken = (req, res, next, db) => {
  db
    .any('SELECT id, email, name FROM users WHERE id = $1', [req.user.id])
    .then(function(data) {
      const { name, email } = data[0];
      res.json({ name, email });
    })
    .catch(function(err) {
      return next(err);
    });
};

const loginWithToken = (req, res, next, db) => {
  db
    .any(
      'SELECT id, password, name FROM users WHERE email = $1 AND token = $2',
      [req.body.email, req.body.token]
    )
    .then(function(data) {
      if (!data.length) {
        res.status(200).json({ error: 'User not found' });
      } else {
        const { id, name } = data[0];
        jwt.sign({ id }, config.AUTH_SECRET_KEY, (err, jwt) => {
          res.json({ id, name, token: req.body.token, success: true, jwt });
        });
      }
    })
    .catch(function(err) {
      return next(err);
    });
};

const logout = (req, res, next, db) => {
  db
    .any("UPDATE users SET token = '' WHERE id = $1", [req.body.id])
    .then(function(data) {
      res.status(200).json({ success: true });
    });
};

const sendResetPasswordEmail = (req, res, next, db) => {
  const token = generateToken();

  db
    .any('SELECT id FROM users WHERE email = $1', [req.body.email])
    .then(function(data) {
      if (data.length) {
        const { id } = data[0];
        db
          .any('UPDATE users SET reset_token = $1 WHERE email = $2', [
            token,
            req.body.email
          ])
          .then(function(data) {
            mailgun.messages().send({
              from: 'PushApp <noreply@getpushapp.com>',
              to: req.body.email,
              subject: `Reset password for PushApp`,
              html: mailTemplates.forgotPassword(id, token)
            }, function(error, body) {
              if (error) {
                console.log(error);
              }
            });
            res.status(200).json({ success: true });
          });
      } else {
        res.status(200).json({ success: false });
      }
    });
};

const getUserByEmail = (req, res, next, db) => {
  db
    .any('SELECT * FROM users WHERE email = $1', [req.body.email])
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

const registerUser = (req, res, next, db, sendMail) => {
  {
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRegex.test(req.body.email)) {
      res
        .status(200)
        .json({ success: false, error: 'Invalid email, please try again' });
      return next();
    }

    db
      .any(
        'INSERT INTO users(email, password, name, created) VALUES($1, $2, $3, $4)',
        [req.body.email, req.body.password, req.body.name, getDate()]
      )
      .then(function(data) {
        const token = sha256(
          Math.round(
            new Date().getMilliseconds() * Math.random() * 10000000000000
          ).toString()
        );
        db
          .any('UPDATE users SET token = $2, lastLogin = $3 WHERE email = $1', [
            req.body.email,
            token,
            getDate()
          ])
          .then(function(data) {
            sendMail(req.body.email, req.body.name);
            res.status(200).json({ token: token, success: true });
            return next();
          });
      })
      .catch(function(err) {
        return next(err);
      });
  }
};

const updateUser = (req, res, next, db) => {
  db
    .any('UPDATE users SET name = $1 WHERE id = $2', [
      req.body.name,
      req.body.id
    ])
    .then(function(data) {
      res
        .status(200)
        .json({ success: true, result: `Change name to ${req.body.name}` });
    })
    .catch(function(err) {
      return next(err);
    });
};

const resetPasswordPost = (req, res, next, db) => {
  const { passwordOne, passwordTwo } = req.body;

  if (passwordOne !== passwordTwo) {
    res.status(200).json({ success: false });
  }

  db
    .any(
      "UPDATE users SET password = $1, reset_token = '' WHERE id = $2 AND reset_token = $3",
      [passwordOne, req.params.id, req.params.token]
    )
    .then(function(data) {
      res.status(200).json({ success: true });
    })
    .catch(function(err) {
      return next(err);
    });
};

const resetPasswordGet = (req, res, next, db) => {
  db
    .any('SELECT * FROM users WHERE id = $1 AND reset_token = $2', [
      req.params.id,
      req.params.token
    ])
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

module.exports = {
  getAllUsers,
  login,
  loginJWT,
  verifyToken,
  loginWithToken,
  resetPasswordPost,
  resetPasswordGet,
  updateUser,
  registerUser,
  getUserByEmail,
  sendResetPasswordEmail,
  logout
};
