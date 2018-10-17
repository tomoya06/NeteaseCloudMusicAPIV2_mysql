const mysql = require('mysql');

const dbConfig = require(`${__dirname}/../sql-query/dbConfig.json`)

const pool = mysql.createPool(dbConfig);

function multyQueryDBresponse(res, sqls) {

  const results = {}
  const errors = {}
  let code = 200
  
  const keys = Object.keys(sqls)
  const sqlCount = keys.length

  let finishedSql = 0

  const sqlDone = function() {
    finishedSql++
    if (finishedSql===sqlCount) {
      if (Object.keys(errors).length!==0) { code = 502; }

      res.status(code).send({
        ...results,
        errors,
        code
      })
    }
  }

  keys.forEach((key) => {
    queryDBpromise(sqls[key])
      .then((_res) => {
        results[key] = _res;
        sqlDone();
      })
      .catch((_err) => {
        errors[key] = _err;
        sqlDone();
      })
  })
}

function queryDBresponse(res, sql, key = 'results') {

  const result = {}

  queryDBpromise(sql)
    .then((_res) => {
      result[key] = _res;
      result.code = 200;
      res.send(result)
    })
    .catch((_err) => {
      result['error'] = _err;
      result.code = 502;
      res.status(result.code).send(result)
    })

}

function queryDBpromise(sql) {
  return new Promise((resolve, reject) => {
    console.log(`[SQL QUERY]: exec "${sql}"`)
    pool.getConnection((err, conn) => {
      if (err) { return reject(err) }
        conn.query(sql, (err, results, fields) => {
          if (err) { return reject(err)}

          if (sql.indexOf('COUNT')>=0 || sql.indexOf('count')>=0) {
            return resolve(results[0][Object.keys(results[0])[0]])
          }

          if (sql.indexOf('limit 1;')>=0 || sql.indexOf('LIMIT 1;')>=0) {
            return resolve(results[0])
          } 

          return resolve(results);
        })
    })
  })
}

module.exports = {
  queryDBpromise,
  queryDBresponse,
  multyQueryDBresponse,
}