var mongoose = require("mongoose");
var GameArea = require("../mongooseModels/GameArea");
var Player = require("../mongooseModels/Player");

var p = mongoose.connect(
  "mongodb+srv://Admintest:test@gettingstarted-sh6ir.mongodb.net/gameDemo?retryWrites=true",
  { useNewUrlParser: true, useCreateIndex: true }
);
p.then(con => console.log("Connected -----"));

setTimeout(() => mongoose.disconnect(), 3000);

const polygon = {
  type: "Polygon",
  name: "Intro-game",
  coordinates: [
    [
      [12.541322708129883, 55.77415929267225],
      [12.577714920043945, 55.7767661102896],
      [12.576856613159178, 55.78038640106636],
      [12.58277893066406, 55.78231708529588],
      [12.581834793090819, 55.78661251449472],
      [12.578573226928711, 55.788784180465655],
      [12.576513290405273, 55.79433344350657],
      [12.569818496704102, 55.795732698062174],
      [12.541322708129883, 55.77415929267225]
    ]
  ]
};

const playersArray = [
  {
    name: "KurtOutside",
    location: {
      type: "Point",
      coordinates: [12.549648284912108, 55.786081644399324]
    }
  },
  {
    name: "PeterOutside",
    location: {
      type: "Point",
      coordinates: [12.561063766479492, 55.79235510128348]
    }
  },
  {
    name: "AdamInside",
    location: {
      type: "Point",
      coordinates: [12.56338119506836, 55.783958091676986]
    }
  },
  {
    name: "HelleInside",
    location: {
      type: "Point",
      coordinates: [12.557458877563475, 55.77850389183611]
    }
  },
  {
    name: "JanInside",
    location: {
      type: "Point",
      coordinates: [12.572307586669922, 55.78275147606406]
    }
  }
];

(async function makeData() {
  await GameArea.deleteMany({});
  await Player.deleteMany({});
  const game = await new GameArea(polygon).save();
  console.log("Saved a game: ", game);
  const players = await Player.insertMany(playersArray);
  console.log(`Saved ${players.length} players.`);
})();
