const { User } = require('../../../src/models/user.model.js');
const moment = require('moment');
const faker = require('faker');
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const save = jest.fn();
const createFakeUser = () => {
  const password = faker.internet.password(8, true);
  const user = new User({
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirm: password,
    birthDate: faker.date.between(
      moment().subtract(11, 'years'),
      moment().subtract(150, 'years')
    ), // from 11 to 150 years
    gender: 'M',
    verified: false,
    country: 'EG',
    images: [
      'uploads\\users\\default-Profile.jpg',
      'uploads\\users\\default-Cover.jpg'
    ],
    _id: mongoose.Types.ObjectId()
  });
  user.save = jest.fn().mockImplementation(function (Options) {
    save();
    return new Promise(function (resolve, reject) {
      resolve(this);
    });
  });

  return user;
};

const users = [createFakeUser(), createFakeUser(), createFakeUser()];

User.create = userData => {
  return new Promise((resolve, reject) => {
    if (
      _.some(users, ['username', userData.username]) ||
      _.some(users, ['email', userData.email])
    ) {
      reject({ error: 'That username already exists.' });
    } else {
      const newUser = new User({
        _id: mongoose.Types.ObjectId(),
        ...userData._doc
      });

      bcrypt.hash(newUser.password, 8).then(
        result => {
          newUser.password = result;
          newUser.passwordConfirm = undefined;
          newUser.save = jest.fn().mockImplementation(function () {
            save();
            return new Promise(function (resolve, reject) {
              resolve(this);
            });
          });
          users.push(newUser);
          resolve(newUser);
        },
        err => { }
      );
    }
  });
};

User.findOne = jest.fn().mockImplementation(userData => {
  return {
    select: jest.fn().mockResolvedValue(
      new Promise((resolve, reject) => {
        const user = _.find(users, function (obj) {
          return obj.email == userData.email;
        });
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      })
    )
  };
});

User.findById = jest.fn().mockImplementation((id, options) => {
  return new Promise((resolve, reject) => {
    const user = _.find(users, function (obj) {
      return obj._id == id;
    });
    if (user) {
      resolve(user);
    } else {
      resolve(null);
    }
  });
});

User.findByIdAndUpdate = jest.fn().mockImplementation((id, options) => {
  return new Promise((resolve, reject) => {
    const user = _.find(users, function (obj) {
      return obj._id == id;
    });
    if (options && options.images) {
      user.images[0] = options.images[0]
    }
    if (user) {
      resolve(user);
    } else {
      resolve(null);
    }
  });
});

findByIdWithPopulate = jest.fn().mockImplementation(id => {
  return {
    populate: jest.fn().mockResolvedValue(
      new Promise((resolve, reject) => {
        const user = _.find(users, function (obj) {
          return obj._id == id;
        });
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      })
    )
  };
});

User.findByIdAndDelete = jest.fn().mockImplementation((userId) => {
  return new Promise((resolve, reject) => {
    let user = _.find(users, function (obj) {
      return obj._id == userId;
    });
    const idx = users.indexOf(user);
    user = users.splice(idx, 1);
    if (user) {
      resolve(user);
    } else {
      resolve(null);
    }
  })
});

findByIdWithSelect = jest.fn().mockImplementation((id) => {
  return {
    select: jest.fn().mockResolvedValue(
      new Promise((resolve, reject) => {
        const user = _.find(users, function (obj) {
          return obj._id == id;
        });
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      })
    )
  };
});
module.exports = {
  createFakeUser,
  User,
  users,
  findByIdWithSelect,
  findByIdWithPopulate,
  save
};
