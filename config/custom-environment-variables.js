module.exports = {
    database: {
      host: 'DATABASE_HOST',
      port: 'DATABASE_PORT',
      username: 'DATABASE_USERNAME',
      password: 'DATABASE_PASSWORD',
      name: 'DATABASE_NAME',
      client: 'DATABASE_CLIENT',
    },
    log: {
      level: 'LOG_LEVEL',
      disabled: 'LOG_DISABLED',
    },
    cors: {
      origins: 'CORS_ORIGIN',
      maxAge: 'CORS_MAX_AGE',
    },
    env: {
      env: 'NODE_ENV',
      port: 'PORT',
    },
    auth: {
      jwt: {
        secret: 'AUTH_JWT_SECRET',
      },
    },
  };