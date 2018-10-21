const { queryDBresponse } = require(`${__dirname}/../util/database.js`);

module.exports = (req, res, createWebAPIRequest, request) => {

	if (req.method != "POST") {
		res.status(403).send({
			message: 'Wrong Request Methods',
			code: 403
		})
		return;
	}

	const body = req.body;

	try {

		const { userId, resourceId, typeId } = body;
		const sql = extractQuerySql(userId, resourceId, typeId);
		queryDBresponse(res, sql);

	} catch(error) {
		res.status(400).send({
			code: 400,
			message: 'Params missing.'
		})
	}

}

function extractQuerySql(userId, resourceId, typeId) {

	return `
		INSERT INTO Usr_Liked_Resource
		(usr_id, resource_id, type_id)
		VALUES
		(${userId}, ${resourceId}, ${typeId});
	`;

}