const {
  queryDBresponse,
} = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const sql = extractQuerySql(req.body);

	queryDBresponse(res, sql);

}

function extractQuerySql(body) {
	return `
	
	`;
}