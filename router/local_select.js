const legitColumns = require(`${__dirname}/../sql-query/legitColumns.json`)
const queryDBresponse = require(`${__dirname}/../util/database.js`).queryDBresponse

module.exports = (req, res, createWebAPIRequest, request) => {

	const type = req.query.type || 'song';
	const limit = req.query.limit || 10;
	const page = req.query.page || 0;

	const sql = extractQuery(type, limit, page);

	queryDBresponse(res, sql, type);
	
}

function extractQuery(type, limit, page) {
	return `select * from ${type} limit ${limit} offset ${page*limit}`
}