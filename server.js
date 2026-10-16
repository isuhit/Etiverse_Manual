const app = require("./app");
const config = require("./src/config/env");
const connectDB = require("./src/config/db");


const PORT = config.port;

connectDB().then(() => {
    app.listen(PORT, (response) => {
        console.log(`Server running on port ${port}`);
    });
});
