const legitColumns = require(`${__dirname}/../sql-query/legitColumns.json`)

const queryDBresponse = require(`${__dirname}/../util/database.js`).queryDBresponse;

module.exports = (req, res, createWebAPIRequest, request) => {
  const { type } = req.query;

  const body = req.body;

  // console.log('=== extract body ===')
  // Object.keys(body).forEach((key) => {
    // console.log(`[${key}]: ${body[key]}`)
    // console.log('===')
  // })

  let sql = extractQuery(type, body);

  queryDBresponse(res, sql);
}

function extractQuery(type, body) {
  let columns = '', values = '';

  Object.keys(body).forEach((key) => {
    if (legitColumns[type].indexOf(key) >= 0) {
      columns += `${key}, `;
      values += `'${body[key]}', `
    }
  })
  columns = columns.substring(0, columns.length-2)
  values = values.substring(0, values.length-2)

  const sql = `INSERT INTO ${type} (${columns}) VALUES (${values})`

  return sql;
}

