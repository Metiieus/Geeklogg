// index.js
const functions = require("firebase-functions");
const app = require("./server.cjs");

exports.api = functions.https.onRequest(app);
