const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

module.exports = {
    NODE_ENV : process.env.NODE_ENV,

    PORT : process.env.PORT,
    
    MONGO_URI : process.env.MONGO_URI,
    
    DROPBOX_ACCESS_TOKEN : process.env.DROPBOX_ACCESS_TOKEN,
    
    
    DROPBOX_API : process.env.DROPBOX_API,
    JWT_SECRET :  process.env. JWT_SECRET


};