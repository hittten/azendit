const express = require('express')
const app = express()
const port = 3000

/* How to make an endpoint ?
  - Define a path
  - Get some params o query
  - Make some validation if is necesary
  - Find somthing in the database
  - Return a json with some data
*/
app.get('/tasks', (req, res) => {

  const mysql = require('mysql');
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'aszendit'
  });

  connection.connect();

  connection.query('SELECT * FROM tasks', function (err, rows, fields) {
    if (err) {
      console.error(err)

      res.sendStatus(500)
      return
    };

    const json = rows.map(r => {
      r.done = r.done === 1
      return r
    })

    res.send(json)
  });

  connection.end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
