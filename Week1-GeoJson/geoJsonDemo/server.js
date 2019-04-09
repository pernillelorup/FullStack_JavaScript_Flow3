const server = require("./app");
server(3333).then(()=> console.log("Server started"))