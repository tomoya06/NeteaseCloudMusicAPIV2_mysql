const { queryDBpromise } = require(`${__dirname}/../util/database.js`)

module.exports = async (req, res, createWebAPIRequest, request) => {

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

	let [error, artistBaseInfos] = await queryDBpromise(getArtistBaseInfoQuery(artist_id))

	const artistBaseInfo = artistBaseInfos[0]

	if (error) {
		res.status(502).send({
			error,
			code: 502,
		})
		return;
	}

	let _albums;
	[error, _albums] = await queryDBpromise(appendArtistAlbumsQuery(artist_id));

	if (error) {
		res.status(502).send({
			error,
			code: 502,
		})
		return;
	}

	_albums.forEach((album) => {
		album.artist = artistBaseInfo;
	})

	res.send({
		artist: artistBaseInfo,
		hotAlbums: _albums,
		code: 200
	})

}

function getArtistBaseInfoQuery(artist_id) {
	return `
		SELECT 
		artist_id as id,
		artist_name as name
		FROM ARTISTS  
		WHERE artist_id=${artist_id}
	`;
}


function appendArtistAlbumsQuery(artist_id) {
	return `
		SELECT
		_albums.album_name as name,
		_albums.album_id as id,
		_albums.album_pic_url as picUrl,
		_albums.artist_id as artist_id,
		(
			SELECT COUNT(*)
			FROM SONGS WHERE SONGS.album_id=_albums.album_id
		) as size,
		_albums.type as type,
		_albums.publish_time as publishTime
		FROM ALBUMS _albums 
		WHERE _albums.artist_id=${artist_id}
		ORDER BY publishTime DESC
	`;
}

