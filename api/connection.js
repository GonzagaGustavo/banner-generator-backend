const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "banner",
});

// connection.query("SELECT * FROM  usuarios", function (err, results, fields) {
//   console.log(results);
// });

module.exports = connection;
