const express = require('express');
const app = express();
const path = require("path")
const multer = require("multer")
const PORT = 3000;
const carsData = require("././carsData.json")
const { v4: uuidv4 } = require('uuid');

// multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  './public/uploadImages')
    },
    filename: (req, file, cb) => {
  
        cb(null, Date.now()+ "---" + file.originalname)
    }
})
const upload = multer({storage: storage})

// middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));



// create car post
app.get("/cars4sale/sell", (req, res) => {
   
    res.render("sellForm")
})

app.post("/cars4sale/sell", upload.single('image'), (req, res) => {
    console.log(req.file)
    const newPost = req.body;
    newPost.img = `/uploadImages/${req.file.filename}`;
 carsData.push(newPost)
    res.redirect("/cars4sale")
})
// read(see) car post
app.get("/cars4sale/:id", (req, res) => {
    const { id } = req.params;
    // compare if post id = to the id params
    carsData.forEach((post) => {
        if (post.id == id) {
            console.log(post)
           res.render("singlePost" , {...post})
        }
    })
  
})
// home route

app.get("/cars4sale", (req, res) => {

 // give a unique id to each post
    carsData.forEach((post) => {
        if (!post.id) {
            post.id = uuidv4();
        }
    })
    console.log(carsData)

    res.render("cars4sale", { carsData })


})

//update car post

//delete car post

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})