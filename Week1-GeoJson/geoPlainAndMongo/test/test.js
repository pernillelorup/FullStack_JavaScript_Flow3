const expect = require("chai").expect;
const fetch = require("node-fetch");
const geoServer = require("../app");
const PORT = 2345;
const URL = `http://localhost:${PORT}/geoapi`;
let server;

const gameArea = {
  type: "Polygon",
  coordinates: [[[0, 0], [6, 0], [6, 6], [0, 6], [0, 0]]]
};
const players = [
  {
    type: "Feature",
    properties: { name: "Player-1" },
    geometry: {
      type: "Point",
      coordinates: [3, 3]
    }
  },
  {
    type: "Feature",
    properties: { name: "Player-2" },
    geometry: {
      type: "Point",
      coordinates: [7,7]
    }
  }
];

describe("Geo API Test", function() {
  before(async function() {
    server = await geoServer(PORT, gameArea, players);
  });

  after(async function() {
    await server.close();
  });

  describe("testing isuserinarea", function() {
    it("Should find user in gameArea", async function() {
      result = await fetch(`${URL}/isuserinarea/3/3`).then(res => res.json());
      expect(result.status).to.be.true;
    });
    it("Should NOT find user in gameArea", async function() {
      result = await fetch(`${URL}/isuserinarea/7/3`).then(res => res.json());
      expect(result.status).to.be.false;
    });
  });
   
  /*
   Acording to: https://www.movable-type.co.uk/scripts/latlong.html
   the distance between [5.3] and [3,3] is 222400 meters
   The distance between [5.3] and [7,7] is 495100 meters
  */
  describe("testing findNearbyPlayers", function() {
    it("Should find one player", async function() {
      result = await fetch(`${URL}/findNearbyPlayers/5/3/222500`).then(res => res.json());
      expect(result.length).to.be.equal(1)
    });
    it("Should find two players", async function() {
      result = await fetch(`${URL}/findNearbyPlayers/5/3/497000`).then(res => res.json());
      expect(result.length).to.be.equal(2)
    });
    it("Should find 0 players", async function() {
      result = await fetch(`${URL}/findNearbyPlayers/5/3/22210`).then(res => res.json());
      expect(result.length).to.be.equal(0)
    });
  });

  /*
   Acording to: https://www.movable-type.co.uk/scripts/latlong.html
   the distance between [3.1,3.1] and [3,3] is 15710 meters
  */
  describe("testing distanceToUser/:lon/:lat/:username", function() {
    it("Should find the distance to player-1 to be approx 15710 meters", async function() {
      result = await fetch(`${URL}/distanceToUser/3.1/3.1/Player-1`).then(res => res.json());
      expect(Number(result.distance)).to.be.greaterThan(15500);
      expect(Number(result.distance)).to.be.lessThan(16000);
    });
    
  });
});
