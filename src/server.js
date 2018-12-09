const app = require('./app');
const http = require('http');
const server = http.createServer(app);

server.listen(3000);

server.on("listening", () => {
    console.log("Server is listening for requests on port 3000");
});