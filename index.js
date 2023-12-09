import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser"
import morgan from "morgan";
import axios from "axios";
import {weatherAPI} from "./secrets/apiKey.js";
const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({extended : true}));// mounting middleware
app.use(morgan('tiny'));

app.post("/submit", (req, res)=>{
    const baseURL = "http://api.openweathermap.org";
    const locationEndpoint = "/geo/1.0/direct"
    const weatherEndpoint = "/data/2.5/weather"
    const cityName = req.body.cityName;
    const apiKey = weatherAPI.key;
    const units = 'metric'
    axios.get(baseURL+locationEndpoint+`?q=${cityName}&appid=${apiKey}`).then(
        (response) => {
            let {data :[{lat : latitude, lon : longitude}]} = response;
            return {
                lat : latitude,
                lon : longitude
            }
        }
    ).then((coordinates) => {
        axios.get(baseURL+weatherEndpoint+`?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`).then(
            (response) => {
                let {data: {main : {temp : temperature, feels_like : feelsLikeTemprature, temp_min:minTemperature, temp_max:maxTemperature}}}= response;
                res.render("index.ejs", {
                    data : {
                        temp : temperature,
                        feels_like : feelsLikeTemprature,
                        temp_min : minTemperature,
                        temp_max : maxTemperature
                    }
                })
            }
        )
    }).catch(() =>{
        res.render("index.ejs",{
            error : {
                message : "Could not fetch the requested location",
            }
        })
    }
    )
    
})
// call back is triggered whenever there is get request on the "/" listening endpoint
app.get("/",(req, res)=>{
    res.render("index.ejs",{
        requestData : true
    });
})

app.listen(port, ()=>{
    console.log(`Server is up and running on ${port}.`);
})