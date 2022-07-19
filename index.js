const dotenv = require("dotenv");
const connectToDatabase = require("./src/database/connect");
//const connectToDatabase = require("./server");
dotenv.config();

connectToDatabase();

require("./server");
