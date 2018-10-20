const { queryDBresponse } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const artist_id = req.query.id;
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	if (!artist_id) {
		res.status(400).send({
			message: 'Artist id is required',
			code: 400,
		})
		return;
	}

	const sql = extractQuerySql(artist_id, limit, offset);

	queryDBresponse(res, sql);

}

function extractQuerySql(artist_id, limit, offset) {

	return `
		SELECT * FROM ALBUMS WHERE artist_id=${artist_id} 
		ORDER BY publish_time DESC 
		LIMIT ${limit} OFFSET ${offset*limit};
	`;

}
