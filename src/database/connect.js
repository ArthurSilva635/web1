const express = require("express");
const app = express();
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(
    "mongodb+srv://" +
      process.env.MONGODB_USERNAME +
      ":" +
      process.env.MONGODB_PASSWORD +
      "@cursonodejs.jt5o9.mongodb.net/?retryWrites=true&w=majority",
    (error) => {
      if (error) {
        return console.log(
          "Ocorreu um erro ao se conectar com o banco de dados",
          error
        );
      }

      return console.log("Conexão com o banco de dados realixado com sucesso!");
    }
  );
};

module.exports = connectToDatabase;
