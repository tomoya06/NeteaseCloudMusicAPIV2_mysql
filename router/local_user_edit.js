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

	if (!req.body.usr_id) {
		res.status(403).send({
			message: 'No usr_id field',
			code: 403,
		})
		return;
	}

	const sql = extractQuerySql(req.body.usr_id, req.body);

	queryDBresponse(res, sql);

}

function extractQuerySql(id, body) {

	let sets = ""

	legitColumns.USRS.forEach((key) => {
		if (body[key]) {
			sets += `${key}="${body[key]}", `
		}
	})

	sets = sets.substring(0, sets.length-2);

	return `
		UPDATE USRS 
		SET 
		${sets}
		WHERE usr_id=${id};
	`
}