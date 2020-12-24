const fs = require('fs');
const lmdb = require('node-lmdb')
const storage = require('find-config')('storage')
const dbName = "poll"
if (!fs.existsSync(storage)){
    fs.mkdirSync('./storage');
}

//const level = require('level-rocksdb')
//const storage = __dirname + '/../../storage/'
//const db = level(storage, { valueEncoding: 'json' })

class db {
  static get(key) {
    var env = new lmdb.Env({ readonly: true });
    env.open({path: storage})
    const pollDb = env.openDbi({ name: dbName, create:true })
    const txn = env.beginTxn()
    const data = txn.getString(pollDb, key)
    txn.commit()
    env.close()
    return JSON.parse(data)
  }

  static put(key, data) {
    var env = new lmdb.Env();
    env.open({path: storage})
    const pollDb = env.openDbi({ name: dbName, create:true })
    const txn = env.beginTxn()
    const rtn = txn.putString(pollDb, key, JSON.stringify(data))
    txn.commit()
    env.close()
    return rtn
  }
}

module.exports = db
