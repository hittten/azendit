import express from 'express';
import { createConnection } from './db';
import { Task, TaskRow } from './types';
const app = express()
const port = 3000

/* How to make an endpoint ?
  - Define a path
  - Get some params o query
  - Make some validation if is necesary
  - Find somthing in the database
  - Return a json with some data
*/
app.get('/tasks', (_, res) => {
  const connection = createConnection()
  connection.connect();

  connection.query('SELECT * FROM tasks', function (err, rows: TaskRow[]) {
    if (err) {
      console.error(err)


      res.sendStatus(500)
      return
    };

    const json: Task[] = rows.map(r => ({ ...r, id: r.id.toString(), done: r.done === 1 }))

    res.send(json)
  });

  connection.end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
