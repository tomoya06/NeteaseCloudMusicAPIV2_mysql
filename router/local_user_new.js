const legitColumns = require(`${__dirname}/../sql-query/legitColumns.json`)

const {
  queryDBresponse,
} = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	// console.log(req)

	if (req.method !== "POST") {
		res.status(403).send({
			message: 'Wrong Request Method',
			code: 403,
		})

		return;
	}

	const sql = extractQuerySql(req.body);

	queryDBresponse(res, sql);

}

function extractQuerySql(body) {

	let keys = "", values = "";

	legitColumns.USRS.forEach((key) => {
		if (body[key]) {
			keys += `${key}, `;
			values += `${body[key] ? '"'+body[key]+'"' : 'NULL'}, `;
		}
	})

	keys = keys.substring(0, keys.length-2);
	values = values.substring(0, values.length-2);

	return `
		INSERT INTO USRS 
		(${keys})
		VALUES
		(${values});
	`
}