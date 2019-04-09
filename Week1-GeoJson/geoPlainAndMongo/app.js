const express = require("express");
const http = require("http");
const app = express();
const gju = require("geojson-utils");


let gameArea = require("./textFileData/gameData").gameArea.geometry;
let players = require("./textFileData/gameData").players;

app.get("/", (req, res) => res.send("Geo Demo!"));

//Use this to set alternative stores for gameArea and players
function setDataStores(ga,p){
  gameArea = ga;
  players = p;
  console.log(JSON.stringify(gameArea))
}

app.get("/geoapi/isuserinarea/:lon/:lat", function(req, res) {
  
  const lon = req.params.lon;
  const lat = req.params.lat;
  const point = { type: "Point", coordinates: [lon, lat] };
  let isInside = gju.pointInPolygon(point, gameArea);
  let result = {};
  result.status = isInside;
  let msg = isInside
    ? "Point was inside the tested polygon"
    : "Point was NOT inside tested polygon";
  result.msg = msg;
  res.json(result);
});

app.get("/geoapi/findNearbyPlayers/:lon/:lat/:rad", function(req, res) {
  const lon = Number(req.params.lon);
  const lat = Number(req.params.lat);
  const rad = Number(req.params.rad);
  const point = { type: "Point", coordinates: [lon, lat] };
  const result = players.filter(player => {
    return gju.geometryWithinRadius(player.geometry, point, rad);
  });
  res.json(result);
});

app.get("/geoapi/distanceToUser/:lon/:lat/:username", function(req, res) {
  const lon = Number(req.params.lon);
  const lat = Number(req.params.lat);
  const username = req.params.username;
  const point = { type: "Point", coordinates: [lon, lat] };
  const user = players.find(player => player.properties.name === username);
  if (!user) {
    res.status(404);
    return res.json({ msg: "User not found" });
  }

  let distance = gju.pointDistance(point, user.geometry);
  result = { distance: distance.toFixed(2), to: username };
  res.json(result);
});

function geoServer(port,area,players) {
  return new Promise((resolve, reject) => {
    if(area && players){
      setDataStores(area,players)
    }
    let server = http.createServer(app);
    server.listen(port, () => {
      resolve(server);
    });
  });
}
module.exports = geoServer;
