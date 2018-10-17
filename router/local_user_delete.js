const {
  queryDBresponse,
} = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	// console.log(req)

	if (req.method !== "DELETE") {
		res.status(400).send({
			message: 'Wrong Request Method',
			code: 400,
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
	return `
		DELETE FROM USRS
		WHERE usr_id=${id};
	`;
}