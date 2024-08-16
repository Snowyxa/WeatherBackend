const jwt = require('jsonwebtoken');

module.exports = async function jwtErrorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      ctx.status = 401;
      ctx.body = {
        code: 'JWT_EXPIRED',
        message: error.message,
        details: error.expiredAt ? { expiredAt: error.expiredAt } : {},
      };
    } else if (error instanceof jwt.JsonWebTokenError) {
      ctx.status = 401; 
      ctx.body = {
        code: 'INVALID_TOKEN',
        message: 'Invalid token. Please log in again.',
      };
    } else {
      throw error;
    }
  }
};
