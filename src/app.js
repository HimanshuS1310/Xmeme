const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const router = express.Router();
const EJS  = require('ejs');



const port = process.env.PORT || 8081;
require("./db/conn");
const Submit = require("./models/memes");
const mongoose = require('mongoose');
const { title } = require("process");


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.engine('html', EJS.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
// app.set("view engine", "hbs");
// app.set("views", template_path);
// hbs.registerPartials(partials_path);


app.get("/", (req, res) => {
    res.render("index", {
        name: "",
        caption: "",
        url: "images/npa2.jpg"
    });
})


app.get('/memes',(req,res,next) =>{
    Submit.find().limit(100)
    .then((data)=>{
        res.status(200).json({
            data
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json({
            error:err
        })
    });
})

app.get('/memes/:id',(req,res,next) =>{
    Submit.findById(req.params.id)
    .then((data)=>{
        res.status(200).json({
            data
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json({
            error:err
        })
    });
})


app.get('/latest.ejs', (req, res) => {
    Submit.find({}, function(err, data) {
        res.status(200).render('latest', {
            name: "",
            caption: "",
            url: "images/npa2.jpg",
            records: data
        })
    }).limit(100).sort( { _id: -1 } )
})
    


// create a new meme in our database
app.post("/", async(req, res) => {
    try{
        const urll = req.body.url;
        if(urll.includes("https") || urll.includes(".http")){
        const submitMeme = new Submit({
            name : req.body.name,
            caption : req.body.caption,
            url : urll,
        })

        const submitted = await submitMeme.save();
        
        res.status(201).render("index", {
            name: req.body.name,
            caption : req.body.caption,
            url : urll, 
        });



    }else{
        res.send("url is not of an image")
    }

        
        
    }catch(error){
        res.status(400).send(error);
    }
})


app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})

