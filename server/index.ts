import http from "http";
import app from "./src/app";
const server = http.createServer(app);

const port = process.env.PORT || 3001;

// server listening 
server.listen(port, ():void => {
  console.log(`Server running on port ${port}`);
});