const map = L.map('map').setView([0,0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



const getdata = async () => {
    // send a get request on server to get data
    const response = await fetch('/api');
    const data = await response.json();
    console.log("Data received = ", data);

    // append data on web page
    // use for of loop to iterate in all key of data
    for (item of data) {

        let marker = L.marker([item.Latitude, item.Longitude]).addTo(map);

        const txt = `The weather here in the Latitude = ${item.Latitude}, Longitude = ${item.Longitude} in area ${item.Weather.location.name} of the region
        ${item.Weather.location.region} is ${item.Weather.current.condition.text}
        with a temperature of ${item.Weather.current.temp_c}&deg celsius
        and the air quality in the area has
        an AQI = ${item.Air.main.aqi} which has following concentration: <br>
        CO concentration = ${item.Air.components.co} in μg/m3 <br>
        NO concentration = ${item.Air.components.no} in μg/m3 <br>
        pm2_5 concentration = ${item.Air.components.pm2_5} in μg/m3 <br>
        pm10 concentration = ${item.Air.components.pm10} in μg/m3` 

        function onMapClick(e) {
            marker.bindPopup(txt).openPopup();
        }        
        map.on('click', onMapClick);
    }

}
getdata();