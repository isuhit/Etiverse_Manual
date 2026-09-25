const app = require("./app");
const config = require("./src/config/env");
const connectDB = require("./src/config/db");


const port = config.port;

connectDB().then(() => {
    app.listen(port, (response) => {
        console.log(`Server running on port ${port}`);
    });
});
