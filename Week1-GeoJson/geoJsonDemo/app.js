var express = require("express");
const http = require("http");
var app = express();
const gju = require("geojson-utils");

var gameArea = require("./gameData").gameArea.geometry;
var players = require("./gameData").players;

app.get("/", (req, res) => res.send("<h1>GeoDemo API</h1>"));
app.get("/geoapi/isuserinarea/:lon/:lat", (req, res) => {
    // const lon = req.params.lon;
    // const lat = req.params.lat;
    const { lon, lat } = req.params;
    const point = { "type": "Point", "coordinates": [lon, lat] }
    let status = gju.pointInPolygon(point, gameArea);
    let result = { status }
    result.msg = status ? "Point was inside the tested polygon" :
        "Point was NOT inside the tested polygon"
    return res.json(result);
})



function setDataStores(ga, pl) {
    gameArea = ga;
    players = pl;
}

function geoServer(port, area, players) {
    return new Promise((resolve, reject) => {
        if (area && players) {
            setDataStores(area, players)
        }
        let server = http.createServer(app)
        server.listen(port, () => {
            resolve(server)
        })
    })
}

module.exports = geoServer;

