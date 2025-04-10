var admin = require("firebase-admin");

var serviceAccount = require("../config/surplussmile-158af-firebase-adminsdk-fbsvc-b9a2481100.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
