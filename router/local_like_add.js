const { queryDBresponse } = require(`${__dirname}/../util/database.js`);

module.exports = (req, res, createWebAPIRequest, request) => {

	try {

		const { usr_id, resource_id, type_id } = req.query;

		const sql = extractQuerySql(usr_id, resource_id, type_id);
		queryDBresponse(res, sql);

	} catch (err) {

		res.status(502).send({
			code: 502,
			message: err,
		})

	}

}

function extractQuerySql(usr_id, resource_id, type_id) {

	return `
		INSERT INTO Usr_Liked_Resource
		(usr_id, resource_id, type_id)
		VALUES
		(${usr_id}, ${resource_id}, ${type_id});
	`;

}