import express from "express";
import bodyparser from 'body-parser';
import ejs from 'ejs';
import axios from 'axios';

const app = express();
const port = 3007;
const apikey="bc6f74adbf78280750c924cf3800e7d1"

app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

function fToC(fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}

app.get("/", (req, res) => {
    res.render('index',{weather: null, error: null});
})

app.post("/", async(req,res)=>{
        const city= req.body.city;
        const url= `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apikey}`;
        
        try{
            const response= await axios.get(url);
            const weather= response.data;

            if(!weather.main){
                res.render('index',{weather: null, error:"Error, please try again"});
            }else{
                console.log(weather);
                const weatherText= `It's ${fToC(weather.main.temp)} degrees Celsius in ${city}`;
                res.render('index', {weather: weatherText, error: null});
            }
        } catch(err){
            res.render('index', {weather: null, error:"Error in fetching weather of city"});
        }
    }
);

app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})
