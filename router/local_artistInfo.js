const { multyQueryDBresponse } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const artist_id = req.query.id;

	if (!artist_id) {
		res.status(400).send({
			message: 'Artist id is required.',
			code: 400,
		})
		return;
	}

	const sqls = extractQuerySqls(artist_id);
	multyQueryDBresponse(res, sqls);

}

function extractQuerySqls(artist_id) {

	const songs = `
		select _songs.*, _albumsOfArtist.publish_time
		from SONGS _songs inner join (
			select * from ALBUMS where artist_id=${artist_id}
		) _albumsOfArtist on _songs.album_id=_albumsOfArtist.album_id
		order by _albumsOfArtist.publish_time limit 10;
	`;

	return {
		info: `SELECT * FROM ARTISTS WHERE artist_id=${artist_id} LIMIT 1;`,
		albums: `SELECT * FROM ALBUMS WHERE artist_id=${artist_id} ORDER BY publish_time DESC LIMIT 10;`,
		songs,
	}

}