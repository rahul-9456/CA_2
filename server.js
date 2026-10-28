const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bookRoutes = require("./routes/bookRoutes");
const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });