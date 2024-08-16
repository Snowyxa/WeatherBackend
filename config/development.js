module.exports = {
    port: 9000,
    env: 'NODE_ENV',
    log: {
        level: 'silly',
        disabled: false,
    },
    
    cors: {
        origins: ['http://localhost:5000'],
        maxAge: 3*60*60,
    },
    database: {
        host: 'DATABASE_HOST',
        port: 'DATABASE_PORT',
        name : 'DATABASE_NAME',
        client: 'DATABASE_CLIENT',
        password: 'DATABASE_PASSWORD',
        username: 'DATABASE_USERNAME',

    },
        auth: {
          argon: {
            saltLength: 16,
            hashLength: 32,
            timeCost: 6,
            memoryCost: 2 ** 17,
          },
          jwt: {
            secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
            expirationInterval: 60 * 60 * 1000, // ms (1 hour)
            issuer: 'vichogent.be',
            audience: 'vichogent.be',
          },
        
      },
};