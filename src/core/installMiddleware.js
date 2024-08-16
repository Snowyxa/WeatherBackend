const config = require('config');
const bodyParser = require('koa-bodyparser');
const koaCors = require('@koa/cors');
const emoji = require('node-emoji');
const koaHelmet = require('koa-helmet');
const { getLogger } = require('./logging');
const ServiceError = require('./ServiceError');
const querystring = require('querystring');
const jwtErrorHandler = require('./jwtErrorHandler');

const NODE_ENV = config.get('env');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

/**
 * Install all required middlewares in the given app.
 *
 * @param {koa.Application} app - The Koa application.
 */
module.exports = function installMiddleware(app) {
  app.use(jwtErrorHandler);

  app.use(
    koaCors({
      origin: (ctx) => {
        if (CORS_ORIGINS.includes(ctx.request.header.origin)) {
          return ctx.request.header.origin;
        }
        return CORS_ORIGINS[0]; 
      },
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      maxAge: CORS_MAX_AGE,
    })
  );

  app.use(async (ctx, next) => {
    getLogger().info(`${emoji.get('fast_forward')} ${ctx.method} ${ctx.url}`);

    const getStatusEmoji = () => {
      if (ctx.status >= 500) return emoji.get('skull');
      if (ctx.status >= 400) return emoji.get('x');
      if (ctx.status >= 300) return emoji.get('rocket');
      if (ctx.status >= 200) return emoji.get('white_check_mark');
      return emoji.get('rewind');
    };

    try {
      await next();

      getLogger().info(
        `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`
      );
    } catch (error) {
      getLogger().error(
        `${emoji.get('x')} ${ctx.method} ${ctx.status} ${ctx.url}`,
        {
          error,
        }
      );

      ctx.status = error.statusCode || 500;
      ctx.body = {
        error: {
          code: error.code || 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Internal server error',
          details: error.details || {},
        },
      };
    }
  });

  app.use(async (ctx, next) => {
    ctx.query = querystring.parse(ctx.querystring);
    await next();
  });

  app.use(bodyParser());

  app.use(koaHelmet());

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      getLogger().error('Error occurred while handling a request', { error });
      let statusCode = error.status || 500;
      let errorBody = {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message,
        details: error.details || {},
        stack: NODE_ENV !== 'production' ? error.stack : undefined,
      };

      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          statusCode = 404;
        }
        if (error.isValidationFailed) {
          statusCode = 400;
        }
        if (error.isUnauthorized) {
          statusCode = 401;
        }
        if (error.isForbidden) {
          statusCode = 403;
        }
      }

      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });
};
