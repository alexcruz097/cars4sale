const express = require('express');
const app = express();
const path = require("path")
const PORT = 3000;

// middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

// home route

app.get("/", (req, res) => {
    res.render("cars4sale")
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})