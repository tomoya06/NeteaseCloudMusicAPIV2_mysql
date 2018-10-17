const { multyQueryDBresponse } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const album_id = req.query.id;
	if (!album_id) {
		res.status(400).send({
			message: 'Album id is required',
			code: 400,
		})
		return;
	}

	const sqls = extractQuerySqls(album_id);

	multyQueryDBresponse(res, sqls);

}

function extractQuerySqls(album_id) {

	return {
		details: `SELECT * FROM ALBUMS WHERE album_id=${album_id} LIMIT 1;`,
		songs: `SELECT * FROM SONGS WHERE album_id=${album_id};`,
		local_size: `SELECT COUNT(*) FROM SONGS WHERE album_id=${album_id};`,
	}

}