const { queryDBresponse } = require(`${__dirname}/../util/database.js`);

module.exports = (req, res, createWebAPIRequest, request) => {

	try {

		const { usr_id, resource_id, type_id } = req.query;

		const sql = extractQuerySql(usr_id, resource_id, type_id);
		queryDBresponse(res, sql);

	} catch (err) {

		res.status(400).send({
			code: 400,
			message: err,
		})

	}

}

function extractQuerySql(usr_id, resource_id, type_id) {

	return `
		DELETE FROM Usr_Liked_Resource
		WHERE usr_id=${usr_id} AND resource_id=${resource_id} AND type_id=${type_id};
	`;

}