require("dotenv").config()

const mongoUri=process.env.MONGO_URI
const port=process.env.PORT || 3030
const nodeEnv= process.env.NODE_ENV || 'development'
const jwtSecret= process.env.JWT_SECRET 
const jwtExpiresIn= process.env.JWT_EXPIRES_IN || '30m'
 if(!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
}
if(!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

module.exports = {mongoUri, port, nodeEnv, jwtSecret, jwtExpiresIn}