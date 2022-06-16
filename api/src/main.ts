import express from 'express';
import {createConnection} from './db';
import {Task, TaskRow} from './types';

const app = express()
app.use(express.json())
const port = 3000

/* How to make an endpoint ?
  - Define a path
  - Get some params o query
  - Make some validation if is necesary
  - Find somthing in the database
  - Return a json with some data
*/
app.get('/tasks', (req, res) => {
  const filter = req.query.filter

  let query = "";
  if (filter === 'completed') {
    query = "WHERE done = 1"
  }

  if (filter === 'pending') {
    query = "WHERE done = 0"
  }

  const connection = createConnection()
  connection.connect();

  connection.query(`SELECT *
                    FROM tasks ${query}`,
    (err, rows: TaskRow[]) => {
      if (err) {
        console.error(err)

        res.sendStatus(500)
        return
      }

      const json: Task[] = rows.map(r => ({...r, id: r.id.toString(), done: r.done === 1}))

      res.send(json)
    });

  connection.end();
})

app.post('/tasks', (req, res) => {
  const description = req.body.description;

  if (!description) {
    res.status(400).send({
      message: 'description is required!'
    })
    return;
  }
  if (description.length > 100) {
    res.status(400).send({
      message: `description is to big! current: ${description.length
      }, max: 100`
    })
    return;
  }
  const connection = createConnection()
  connection.connect()

  connection.query(`INSERT INTO tasks (description, done)
                    VALUES ('${description}', '0')`,
    (err, rows) => {
      if (err) {
        console.error(err)
        res.sendStatus(500)
        return
      }

      res.send({
        id: rows.insertId.toString(),
        description,
        done: false
      })
    });

  connection.end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
