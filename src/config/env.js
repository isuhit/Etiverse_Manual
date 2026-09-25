require("dotenv").config()

const mongoUri=process.env.MONGO_URI
const port=process.env.PORT


module.exports = {mongoUri, port}