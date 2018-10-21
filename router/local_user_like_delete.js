const { queryDBresponse } = require(`${__dirname}/../util/database.js`);

module.exports = (req, res, createWebAPIRequest, request) => {

	if (req.method !== 'DELETE') {
		res.status(403).send({
			message: 'Wrong Request Method',
			code: 403,
		})
		return;
	}

	try {

		const { userId, resourceId, typeId } = req.body;
		const sql = extractQuerySql(userId, resourceId, typeId);
		queryDBresponse(res, sql);

	} catch (err) {

		res.status(400).send({
			code: 400,
			message: 'Params Missing',
		})

	}

}

function extractQuerySql(userId, resourceId, typeId) {

	return `
		DELETE FROM Usr_Liked_Resource
		WHERE usr_id=${userId} AND resource_id=${resourceId} AND type_id=${typeId};
	`;

}