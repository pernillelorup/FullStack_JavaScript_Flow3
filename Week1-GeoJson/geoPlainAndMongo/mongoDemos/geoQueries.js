var mongoose = require("mongoose");
var GameArea = require("../mongooseModels/GameArea");
var Player = require("../mongooseModels/Player");
var gju = require("geojson-utils");

var p = mongoose.connect(
  "mongodb+srv://Admintest:test@gettingstarted-sh6ir.mongodb.net/gameDemo?retryWrites=true",
  { useNewUrlParser: true, useCreateIndex: true }
);
p.then(con => console.log("------------- Connected -------------"));

setTimeout(() => { console.log("Disconnected"); mongoose.disconnect() }, 2000);

async function isPlayerWithin(gameAreaName, playerName, fields) {
  const gameArea = await GameArea.findOne({ name: gameAreaName });

  if (gameArea === null) {
    throw new Error("Game Area Not Found")
  }

  return Player.findOne({
    location: {
      $geoWithin: {
        $geometry: gameArea
      }
    },
    name: playerName

  }, fields)

}

///geoapi/findNearbyPlayers/:lon/:lat/:rad
async function findNearbyPlayers(lon, lat, dist, fields) {
  return Player.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lon, lat] },
        $maxDistance: dist,
        $minDistance: 0 // 0.1
      }
    }
  }, fields)
}

///geoapi/distanceToUser/:lon/:lat/:username
async function findDistanceToPlayerWithGJU(lon, lat, name) {
  const player = await Player.findOne({ name });
  if (player === null) {
    throw new Error("Player ${name} Not Found")
  }
  const point = { type: "Point", coordinates: [lon, lat] };
  const distance = gju.pointDistance(point, player.location);
  return { name, distance }
}

//Use Mongo's aggregation pipeline to calculate result
async function findNearbyPlayersAgg(lon, lat, dist) {
  return Player.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lon, lat]
        },
        maxDistance: dist,
        spherical: true,
        distanceField: "distance"
      }
    }
  ]);
}

//Use Mongo's aggregation pipeline to calculate result
async function findDistanceToPlayerAgg(lon, lat, name) {
  return Player.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lon, lat]
        },
        maxDistance: 100000, //Hard coded distance   
        spherical: true,
        distanceField: "distance"
      }
    },
    { $match: { name: name } },
    { $project: { name: 1, distance: 1, _id: 0 } }
  ]);

}

(async function runTests() {
  console.log("------------- isPlayerWithin -----------------");
  const helle = await isPlayerWithin("Intro-game", "HelleInside", { name: 1, _id: 0 });
  console.log("Helle is Game Area", helle);
  const kurt = await isPlayerWithin("Intro-game", "KurtOutside", { name: 1, location: 1, _id: 0 });
  console.log("Kurt is Game Area", kurt);

  console.log("------------- findNearbyPlayers, location given is for 'JanInside' --------------");
  const players = await findNearbyPlayers(12.572307586669922, 55.78275147606406, 10000, { name: 1, _id: 0 });
  console.log(players)

  console.log("------------- findDistanceToPlayerWithGJU, location given is for 'JanInside' --------------");
  const dist = await findDistanceToPlayerWithGJU(12.572307586669922, 55.78275147606406, "PeterOutside");
  if (dist) console.log(`${dist.name}, Distance: ${dist.distance.toFixed(2)} m.`);

  console.log("################## Methods using mongo's aggregation pipeline ###########");
  console.log("-------  findNearbyPlayersAgg -- Location given is for 'JanInside'-------")
  const players2 = await findNearbyPlayersAgg(12.572307586669922, 55.78275147606406, 10000);
  players2.forEach(p => { console.log(`${p.name}, Distance: ${p.distance.toFixed(2)}m`) });

  console.log("------------------ findDistanceToPlayerAgg -------------");
  const d = await findDistanceToPlayerAgg(12.572307586669922, 55.78275147606406, "KurtOutside")
  if (d) console.log(d);
})()