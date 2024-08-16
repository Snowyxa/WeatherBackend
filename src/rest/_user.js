const Router = require('@koa/router');
const userService = require('../service/user');
const { requireAuthentication } = require('../core/auth');
const Joi = require('joi');
const validate = require('../core/validation');

const login = async (ctx) => {
  const { email, password } = ctx.request.body;

  try {
    const { user, token } = await userService.login(email, password);
    ctx.body = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = { message: error.message };
  }
};
login.validationScheme = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

const createUser = async (ctx) => {
  try {
    const { user, token } = await userService.createUser(ctx.request.body);
    ctx.status = 201;
    ctx.body = {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = { message: error.message };
  }
};
createUser.validationScheme = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  },
};

const getUser = async (ctx) => {
  try {
    const user = await userService.getUserById(ctx.params.id);
    ctx.body = user;
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = { message: error.message };
  }
};
getUser.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updatePassword = async (ctx) => {
  try {
    const user = await userService.updateUserPassword(ctx.params.id, ctx.request.body);
    ctx.body = user;
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = { message: error.message };
  }
};
updatePassword.validationScheme = {
  params: {
    id: Joi.number().required(),
  },
  body: {
    password: Joi.string().required(),
  },
};

const updateUserContactDetails = async (ctx) => {
  try {
    const user = await userService.updateUserContactDetails(ctx.params.id, ctx.request.body);
    ctx.body = user;
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = { message: error.message };
  }
};
updateUserContactDetails.validationScheme = {
  params: {
    id: Joi.number().required(),
  },
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
  },
};

const deleteUser = async (ctx) => {
  try {
    const user = await userService.deleteUser(ctx.params.id);
    ctx.body = user;
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = { message: error.message };
  }
};
deleteUser.validationScheme = {
  params: {
    id: Joi.number().required(),
  },
};

const findUserByEmail = async (ctx) => {
  try {
    const email = ctx.request.body.email;
    const user = await userService.findUserByEmail(email);
    ctx.body = user;
  } catch (error) {
    ctx.status = error.statusCode || 500;
    ctx.body = { message: error.message };
  }
};
findUserByEmail.validationScheme = {
  body: {
    email: Joi.string().email().required(),
  },
};

module.exports = (app) => {
  const router = new Router({ prefix: '/user' });

  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(createUser.validationScheme), createUser);
  router.get('/:id', requireAuthentication, validate(getUser.validationScheme), getUser);
  router.put('/:id/password', requireAuthentication, validate(updatePassword.validationScheme), updatePassword);
  router.put('/:id/contact-details', requireAuthentication, validate(updateUserContactDetails.validationScheme), updateUserContactDetails);
  router.delete('/:id', requireAuthentication, validate(deleteUser.validationScheme), deleteUser);
  router.post('/find-user', validate(findUserByEmail.validationScheme), findUserByEmail);
  
  app.use(router.routes()).use(router.allowedMethods());
};
