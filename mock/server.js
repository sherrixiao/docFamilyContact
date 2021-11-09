const express=require('express');
const bodyParser = require("body-parser");

let app=express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', '*');
    // if (localStorage.getItem('Authorization')) {
    //     res.headers.Authorization = localStorage.getItem('Authorization');
    // }
    next();
});

app.get('/',function (req,res){
    res.send("hello")
})
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api',require("./mockAPI"))
app.listen('8090')
