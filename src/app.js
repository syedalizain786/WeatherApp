const express=require("express");
//hbs (handle bars)is template engine just like ejs
const hbs=require("hbs");
const path=require("path");
const app=express();

//Reuire weather data
const weatherData=require("../utils/weatherData");

//define which folder of our app contain static files e.g css media file e.t.c
const publicStaticDirPath=path.join(__dirname,"../public");

//define folder path for views and partials
const viewsPath=path.join(__dirname,'../templates/views');
const partialsPath=path.join(__dirname,'../templates/partials');

//Tell our app about location of views
//view engine is setup
app.set('view engine', 'hbs');
app.set('views', viewsPath);

//Tell our express server about partials location
//defining route for partials using hbs module is easy
hbs.registerPartials(partialsPath);


//Tell our app which variable is containing public file path/data
app.use(express.static(publicStaticDirPath));


//Default route
app.get("/",function(req,res){
    res.render('index',{
        title: 'Weather App'
    })
})
//Weather data route
// localhost:3000/weather?address=lahore...
app.get("/weather",(req,res)=>{
    const address=req.query.address;
    if(!address){
        return res.send({
            error: "You must enter address in search text box."
        })
    }
    weatherData(address,(error,{temperature,description,cityName,icon} ={})=>{
        if(error){
            return res.send({
                error
            })
        }
        console.log(temperature,description,cityName,icon);
        res.send({
            temperature,
            description,
            cityName,
            icon
        })
    })
})
//If any particular route don't exist then show user error
//* route is always at the end of all routes
app.get("*",(req,res)=>{
    res.render('404',{
        title:"Page not found!"
    })
})

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server is running on port "+port);
})