const userService = require('../service/user');
const ServiceError = require('./ServiceError');


const requireAuthentication = async (ctx, next) => {
  try {
    const { authorization } = ctx.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw ServiceError.unauthorized('You need to be signed in');
    }

    const authToken = authorization.substring(7);
    const session = await userService.checkAndParseSession(authToken);

    ctx.state.session = session;
    ctx.state.authToken = authToken;

    await next();
  } catch (error) {
    console.error('Error in requireAuthentication middleware:', error);
    throw ServiceError.unauthorized('You need to be signed in');
  }
};

module.exports = {
  requireAuthentication, 
   
};
