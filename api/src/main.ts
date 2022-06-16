import express from 'express';
import {createConnection} from './db';
import {Task, TaskRow} from './types';
import {getTaskError} from "./validations";

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
  const taskEntry = req.body;
  const message = getTaskError(taskEntry);
  if (message) {
    res.status(400).send({message})
    return
  }

  const connection = createConnection()
  connection.connect()

  connection.query(`INSERT INTO tasks (description, done)
                    VALUES ('${taskEntry.description}', '0')`,
    (err, rows) => {
      if (err) {
        console.error(err)
        res.sendStatus(500)
        return
      }

      res.send({
        id: rows.insertId.toString(),
        description: taskEntry.description,
        done: false
      })
    });

  connection.end();
})

app.put('/tasks/:id', (req, res) => {
  const taskEntry = req.body;
  const message = getTaskError(taskEntry);
  if (message) {
    res.status(400).send({message})
    return
  }

  const id = req.params.id
  taskEntry.done = taskEntry.done ? 1 : 0
  const fields = Object.entries(taskEntry)
    .map(e => `${e[0]} = '${e[1]}'`)
    .join(', ')

  const connection = createConnection()
  connection.connect()

  connection.query(`UPDATE tasks
                    SET ${fields}
                    WHERE id = '${id}'`,
    (err, rows) => {
      if (err) {
        console.error(err)
        res.sendStatus(500)
        return
      }

      if (!rows.affectedRows) {
        res.sendStatus(404)
        return
      }

      res.send({
        id: id,
        description: taskEntry.description,
        done: !!taskEntry.done,
      })
    });

  connection.end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
