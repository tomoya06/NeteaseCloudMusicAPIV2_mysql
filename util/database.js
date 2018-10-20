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
      .then(([error, results]) => {
        if (!error) {
          results[key] = results;
        } else {
          errors[key] = _err;
        }
        sqlDone();
      })
  })
}

function queryDBresponse(res, sql, key = 'results') {

  const result = {}

  queryDBpromise(sql)
    .then(([error, results]) => {
      if (!error) {
        result[key] = results;
        result.code = 200;
      } else {
        result['error'] = error;
        result.code = 502;
      }
      res.send(result)
    })

}

function queryDBpromise(sql) {
  return new Promise((resolve, reject) => {
    console.log(`[SQL QUERY]: exec "${sql}"`)
    pool.getConnection((error, conn) => {
      if (error) { return resolve([error, []]) }
        conn.query(sql, (error, results, fields) => {
          conn.release();
          if (error) { return resolve([error, []])}
          return resolve([null, results]);
        })
    })
  })
}

function saveCharacter(str) {
  return str.replace(/[`~!@#$%^&*()_+-={}|[\]\:";'<>?,.//]*/g, " ")
}

module.exports = {
  queryDBpromise,
  queryDBresponse,
  multyQueryDBresponse,
  saveCharacter,
}