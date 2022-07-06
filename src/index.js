const express = require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb+srv://nishusweet:8052466943@cluster0.n9bf08l.mongodb.net/group41Database" ,
{
    useNewUrlParser: true,
  }
)
.then(() => console.log("MongoDb is connected You are Ready To Goo buddy!"))
.catch((err) => console.log(err.message));


app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
console.log("Yuhoo! Express app is running on port " + (process.env.PORT || 3000));
});
