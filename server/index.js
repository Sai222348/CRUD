const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
const port = 8000;

// CORS FIXED — PATCH now allowed

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type'],
    })
);

// Load users from sample.json
let users = [];
if (fs.existsSync('./sample.json')) {
    const data = fs.readFileSync('./sample.json', 'utf8');
    users = data ? JSON.parse(data) : [];
}
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);

//Display All Users
app.get('/users', (req, res) => {
    return res.json(users);
});

//Delete User
app.delete('/users/:id', (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err, data) => {
        return res.json(filteredUsers)
    });
});

//Add New User

app.post('/users', (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ "message": "All fields are required" });
    }
    let id = Date.now();
    users.push({ id, name, age, city });

    fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).send({ "message": "Error saving user" });
        }
        return res.json(users);
    });
});

//Update User

app.patch('/users/:id', (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;

    let index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return res.status(404).send({ message: "User not found" });
    }

    users[index] = { id, name, age, city };

    fs.writeFile("./sample.json", JSON.stringify(users), () => {
        return res.json({ message: "User updated successfully", users });
    });
});


app.listen(port, (err) => {
    console.log(`App is running in http://localhost:${port}`);
});