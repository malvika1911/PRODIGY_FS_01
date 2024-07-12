
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

// Set up paths
const templatePath = path.join(__dirname, '../templates');

// Set up Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.set("view engine", "ejs");
app.set("views", templatePath);

const startServer = async () => {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect("mongodb://localhost:27017");
        console.log("Connected to MongoDB");

        const db = client.db("Users");
        const collection = db.collection("users");

        // Define routes
        app.get("/", (req, res) => {
            res.render("login", { error: null });
        });

        app.get("/signup", (req, res) => {
            res.render("signup", { error: null });
        });

        app.post("/signup", async (req, res) => {
            const { name, password } = req.body;
            try {
                const existUsername = await collection.findOne({ name: req.body.name });
                if (existUsername) {
                    res.render("signup", { error: "Username already exists" });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
                    const data = {
                        name,
                        password: hashedPassword,
                    };
                    await collection.insertOne(data);
                    res.render("home", { message: "Account created successfully!" });
                }
            } catch (error) {
                console.error("Error during signup:", error);
                res.status(500).send("Error during signup");
            }
        });

        app.post("/login", async (req, res) => {
            const { name, password } = req.body;
            try {
                const user = await collection.findOne({ name });
                if (user && await bcrypt.compare(password, user.password)) { // Compare the hashed password
                    res.render("home");
                } else {
                    res.render("login", { error: "Invalid username or password" });
                }
            } catch (error) {
                console.error("Error during login:", error);
                res.status(500).send("Error during login");
            }
        });

        // Start the server
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB or starting the server:", error);
    }
};

startServer();



