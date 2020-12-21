const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db')
const ethers = require('ethers')
const assert = require('assert')
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
  
app.post('/api/v1/getHash', async (req, res, next) => {
  try {
    const { contract, pollId, choice, address } = req.body
    assert (contract.length == 42, 'The length of contract address should be 42.')
    assert (parseInt(pollId) >= 0 && parseInt(pollId) < 10000, 'The pollId should be less than 10000.')
    assert (parseInt(choice) >= 1 && parseInt(choice) < 11, 'The number of choices should be less than 11.')
    assert (address.length == 42, 'The address length should be 42.')
    const dbKey = ethers.utils.id(`saltHash-${contract}-${pollId}`)
    let pollSalt 

    try {
      pollSalt = await db.get(dbKey)
    } catch (err) {
      if (err.name == 'NotFoundError') {
        pollSalt = ethers.utils.hexlify(ethers.utils.randomBytes(32))      
        await db.put(dbKey, pollSalt)
      } else {
        throw err
      }
    }
    let hash = ethers.utils.solidityKeccak256(['uint8', 'address', 'bytes32'],[choice, address, pollSalt])
    res.send({ hash })
  } catch (err) {
    res.status(400).send({ err: err.message })
    next(err)
  }
})  

app.listen(port, () => {
  console.log(`The blindPoll hash app listening at ${port}`)
})