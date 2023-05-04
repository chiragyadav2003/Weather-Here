let lat, lon;

if ("geolocation" in navigator) {
    console.log("Geolocation is available")
    navigator.geolocation.getCurrentPosition(async (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        
        const map = L.map('map').setView([lat,lon], 12);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup("<b>!! Jai Shree Ram !!</b><br>This is my location").openPopup();
        console.log("current location is successfully mappend on the map");

        document.getElementById("latitude").textContent = lat.toFixed(4);
        document.getElementById("longitude").textContent = lon.toFixed(4);

     const response = await fetch(`/weather/${lat},${lon}`);
       const json = await response.json();
       console.log(json);

       const weather = json.WEATHER
       const air = json.AIR_QUALITY.list[0]
       
    //    display weather info 
    document.getElementById("area").textContent = weather.location.name;
    document.getElementById("region").textContent = weather.location.region;
    document.getElementById("condition.text").textContent = weather.current.condition.text;
    document.getElementById("temp_c").textContent = weather.current.temp_c;

    document.getElementById("aqi").textContent = air.main.aqi
    document.getElementById("co").textContent = air.components.co
    document.getElementById("no").textContent = air.components.no
    document.getElementById("pm2_5").textContent = air.components.pm2_5
    document.getElementById("pm10").textContent = air.components.pm10

    //now we will send this data to server by making a post request
    const data = {Latitude : lat,
                  Longitude : lon,
                  Weather :  weather,
                  Air : air}
    const options = {
     method:"POST",
     headers:{
        'Content-Type':'application/json'
     },
     body:JSON.stringify(data)
    }

    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();
    console.log("Post data to server successfully")   

    });
}
else {
    console.log("Geolocation is not available")
}


