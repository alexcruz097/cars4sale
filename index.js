const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const methodOverride = require("method-override");
const PORT = 3000;
let carsData = require("././carsData.json");
const { v4: uuidv4 } = require("uuid");

const { type } = require("os");
const { privateDecrypt } = require("crypto");
// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploadImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "---" + file.originalname);
  },
});
const upload = multer({ storage: storage });
// middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// body parser
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// route to  form to be able to post a car for sale
app.get("/cars4sale/sell", (req, res) => {
  res.render("sellForm");
});
// get form data and manipulated
app.post("/cars4sale/sell", upload.single("image"), (req, res) => {
  const newPost = req.body;
  console.log(req.file)
  newPost.img = `uploadImages/${req.file.filename}`;
  carsData.push(newPost);
  res.redirect("/cars4sale");
});
// read(see) individual car post
app.get("/cars4sale/:id", (req, res) => {
  const { id } = req.params;
  // compare if post id = to the id params
  carsData.forEach((post) => {
    if (post.id == id) {
      res.render("singlePost", { ...post });
    }
  });
});

// home route
app.get("/cars4sale", (req, res) => {
  // give a unique id to each post
  carsData.forEach((post) => {
    //   if post does not have an id then we git it one
    if (!post.id) {
      post.id = uuidv4();
    }
  });
  console.log(carsData[0].email + "this");
  res.render("cars4sale", { carsData });
});

//update car post
app.get("/cars4sale/:id/edit", (req, res) => {
  const { id } = req.params;
  carsData.forEach((carPost) => {
    if (carPost.id === id) {
      res.render("editPost", { ...carPost });
    }
  });
});

app.patch("/cars4sale/:id/edit", upload.single("image"), (req, res) => {
  const newPost = req.body;
  newPost.img = `uploadImages/${req.file.filename}`;
  const { id } = req.params;
  console.log(newPost);

  carsData.forEach((carPost) => {
    if (carPost.id == id) {
      newPost.id=carPost.id
      carPost.email = newPost.email;
      carPost.make = newPost.make;
      carPost.year = newPost.year;
      carPost.phone = newPost.phone;
      carPost.type = newPost.type;
      carPost.trim = newPost.trim;
      carPost.transmission = newPost.transmission
      carPost.locationphone = newPost.location
      carPost.mileage = newPost.mileage;
      carPost.img = newPost.img;
      carPost.price = newPost.price;
      console.log(carPost)
    }
  });
  res.redirect("/cars4sale");
});

//delete car post
app.delete("/cars4sale/:id", (req, res) => {
  // return a new array and filter it
  carsData = carsData.filter((post) => req.params.id !== post.id);
  res.redirect("/cars4sale");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
