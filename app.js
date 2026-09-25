const express = require("express")
const app = express()

app.use(express.json())

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        response: "Server is running",

    })
})

module.exports = app