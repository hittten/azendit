import express from 'express';
import {dbQuery} from './db';
import {Task, TaskRow} from './types';
import {getTaskError} from "./validations";
import {OkPacket} from "mysql";

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

  dbQuery<TaskRow[]>(`SELECT *
                      FROM tasks ${query}`)
    .then((rows) => {
      const json: Task[] = rows
        .map(r => ({
          ...r,
          id: r.id.toString(),
          done: !!r.done
        }))

      res.send(json)
    })
    .catch(() => res.sendStatus(500))
})

app.post('/tasks', (req, res) => {
  const taskEntry = req.body;
  const message = getTaskError(taskEntry);
  if (message) {
    res.status(400).send({message})
    return
  }

  dbQuery<OkPacket>(`INSERT INTO tasks (description, done)
                     VALUES ('${taskEntry.description}', '0')`)
    .then((rows) => {
      res.send({
        id: rows.insertId.toString(),
        description: taskEntry.description,
        done: false
      })
    })
    .catch(() => res.sendStatus(500))
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

  dbQuery<OkPacket>(`UPDATE tasks
                     SET ${fields}
                     WHERE id = '${id}'`)
    .then((rows) => {
      if (!rows.affectedRows) {
        res.sendStatus(404)
        return
      }

      res.send({
        id: id,
        description: taskEntry.description,
        done: !!taskEntry.done,
      })
    })
    .catch(() => res.sendStatus(500))
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id
    const tasks = await dbQuery<TaskRow[]>(`SELECT *
                                            FROM tasks
                                            WHERE id = '${id}'`)

    if (!tasks.length) {
      res.sendStatus(404)
      return
    }

    const result = await dbQuery<OkPacket>(`DELETE
                                            FROM tasks
                                            WHERE id = '${id}'`)

    if (!result.affectedRows) {
      res.sendStatus(500)
      return
    }

    res.send({
      id,
      description: tasks[0].description,
      done: !!tasks[0].done,
    })

  } catch (e) {
    res.sendStatus(500)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
