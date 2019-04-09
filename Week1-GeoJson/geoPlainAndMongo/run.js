const server = require("./app");
server(3000).then(()=>console.log(`Server is started, listening on port 3000`));
