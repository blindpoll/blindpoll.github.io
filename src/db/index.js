const level = require('level-rocksdb')
const rocksdb = level('./storage')

class db {
  static async get(key) {
    return new Promise((resolve, reject) => {
      rocksdb.get(key, (err, data) => {
        if (err) reject(err);
        try {
          const parsedData = JSON.parse(data)
          resolve(parsedData)
        } catch (err) {
          reject(err)
        }
      });
    })
  }

  static async put(key, data) {
    return new Promise((resolve, reject) => {
      try {
        const jsonStr = JSON.stringify(data);
        rocksdb.put(key, jsonStr, (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        });
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = db
