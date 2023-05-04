const express = require('express')

const Datastore = require('nedb')

const app = express()

// install package to set environment variable
// 'npm install dotenv'

//now create .env file and put our environment variable at there

// to access environment variables from .env files
require('dotenv').config()

// to see content of .env file in server
// we can access .env file data useing process.env.(--value to be accessed--)
// console.log(process.env)


app.listen(3000, ()=>console.log('listening at port 3000'))

app.use(express.static('public'))

const database = new Datastore('database.db');

database.loadDatabase();

app.use(express.json({limit:'1mb'}))


// make a get request from client to access data from database
app.get('/api',(request, response)=>{
// .find() function will find everything from the database
//it will also take callback function as an argument 
        database.find({}, (error, data)=>{
            if(error){
                response.end();
                return;
            }
            response.json(data)
    });  
})


//receive data from client side in address '/api' as client made a post request to send data
app.post('/api', (request,response)=>{
    console.log("I got a request , Receiving Data :");

    const data = request.body;

    const Timestamp = Date.now();
    
    data.Timestamp = Timestamp;

    database.insert(data);

    // console.log(data);

    console.log(".... Receiving data completed ....")
    
    response.json(data);

})

//new get request server for weather api
//it will collect data from given api and load it here and send back to client
// this is called PROXY-SERVER
// this happen because we can't be able to make request to api from client side directly
//if our server throw error on fetch then install its package (for fetch 'npm install node-fetch')
app.get('/weather/:latlon', async(request, response)=>{

        // Route parameters
        // Route parameters are named URL segments that are used to capture the values specified at their position in the URL. 
        // The captured values are populated in the req.params object, with the name of the route parameter specified in the path as their respective keys.
        //here request.params will be holding values send alsongside with the address '/weather', i.e, it will be storing info for latlon
        console.log("request.params = ", request.params)
        
        // now we wil split that info using comma and access separately
        const latlon = request.params.latlon.split(',');

        console.log("latlon = ",latlon)
        
        const lat = latlon[0];
        const lon = latlon[1];
        console.log(lat, lon)

        /// pulling api key from environment variable
        const weather_api_key = process.env.API_Key_Weather;
        const weather_url = `http://api.weatherapi.com/v1/current.json?key=${weather_api_key}&q=${lat},${lon}&aqi=yes`
        
        const weather_response = await fetch(weather_url);
        const weather_data = await weather_response.json();
       
        // pulling api key from environment variable
        const air_api_key = process.env.API_Key_Air;
        const aq_api = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${air_api_key}`
        const aq_response = await fetch(aq_api);
        const aq_info = await aq_response.json();

        const data = {
            WEATHER:weather_data,
            AIR_QUALITY:aq_info,
        }

        response.json(data);

})




