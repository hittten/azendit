const express = require('express')
const app = express()
const port = 3000

/* How to make an endpoint?
  - Define a path
  - Get some params o query from the request object
  - Make some validation if is necesary
  - Find somthing in the database
  - Return some json data with the response object
*/
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
