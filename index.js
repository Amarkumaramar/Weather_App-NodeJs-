const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp -273.15).toFixed(1));
    temperature = temperature.replace("{%tempmin%}",(orgVal.main.temp_min -273.15).toFixed(1));
    temperature = temperature.replace("{%tempmax%}",(orgVal.main.temp_max -273.15).toFixed(1));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempststus%}",orgVal.weather[0].main);
    return temperature;

}

const server = http.createServer((req, res) => {
    if(req.url== "/") {
        
        requests(
            `https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=88c6f903b3fe6e631f7d3d395c040a93`
            )
            
          .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];

            // console.log(`city name is ${arrData[0].name} and the temp is ${arrData[0].main.temp} `);
            const realTimeData = arrData.map(val => replaceVal(homeFile, val))
            .join("");
            res.write(realTimeData);
            // res.write(arrData[0].name);
            // console.log(realTimeData);
          })  
          .on("end",  (err) => {
            if (err) return console.log("connection closed due to errors", err);
            res.end();

          });
    }
})

server.listen(8000,"127.0.0.1");
