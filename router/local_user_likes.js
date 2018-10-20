const { queryDBpromise } = require(`${__dirname}/../util/database.js`)

module.exports = async (req, res, createWebAPIRequest, request) => {

	const usr_id = req.query.id;
	const type_id = req.query.type || "1";
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	if (type_id==='1') {

		let [error, _songs] = await queryDBpromise(getLikedSongs(usr_id));

		if (error) {
			res.status(503).send({
				error,
				code: 503
			})
		}

		const songCnt = _songs.length
		let curCnt = 0;

		const queryDone = function() {
			curCnt++
			if (curCnt>=2*songCnt) {
				res.send({
					songs: _songs,
					code: 200,
				})
			}
		}

		_songs.forEach((song) => {
			queryDBpromise(appendSongArtistQuery(song.id))
				.then(([error, results]) => {
					if (!error) {
						song.artists = results;
					} else {
						song.artists = [];
					}
					queryDone();
				})

			queryDBpromise(appendAlbumQuery(song.album_id))
				.then(([error, results]) => {
					if (!error) {
						song.album = results[0];
					} else {
						song.album = {}
					}
					queryDone();
				})
		})

	} else if (type_id==='10') {

		let [error, _albums] = await queryDBpromise(getLikedAlbums(usr_id));

		if (error) {
			res.status(503).send({
				error,
				code: 503,
			})
			return;
		}

		const albumCnt = _albums.length;
		let curCnt = 0;

		const queryDone = function() {
			curCnt++
			if (curCnt>=albumCnt) {
				res.send({
					albums: _albums,
					code: 200,
				})
			}
		}		

		_albums.forEach((album) => {
			queryDBpromise(appendAlbumArtistQuery(album.artist_id))
				.then(([error, results]) => {
					if (!error) {
						album.artist = results[0]
					} else {
						album.artist = {}
					}
					queryDone();
				})
		})

	} else if (type_id==='100') {

		let [error, _artists] = await queryDBpromise(getLikedArtists(usr_id))

		if (error) {
			res.status(503).send({
				error,
				code: 503,
			})
			return;
		}

		res.send({
			artists: _artists,
			code: 200,
		})

	} else if (type_id==='1000') {

		res.status(500).send({
			error: 'No support for playlist yet...',
			code: 500,
		})

	}

}

function getLikedSongs(usr_id) {
	return `
		SELECT 
		_songs.song_id as id,
		_songs.song_name as name,
		_songs.album_id
		FROM (
			SELECT * 
			FROM Usr_Liked_Resource
			WHERE usr_id=${usr_id} AND type_id=1
		) _ulr
		INNER JOIN SONGS _songs 
		ON _ulr.resource_id=_songs.song_id
		ORDER BY _ulr.ope_date DESC
	`;
}

function getLikedAlbums(usr_id) {
	return `
		SELECT 
		_albums.album_id as id,
		_albums.album_name as name,
		_albums.publish_time as publishTime,
		_albums.album_pic_url as picUrl,
		_albums.type as type,
		(
			SELECT COUNT(*) 
			FROM SONGS 
			WHERE SONGS.album_id=_albums.album_id
		) as size,
		_albums.artist_id as artist_id
		FROM (
			SELECT * 
			FROM Usr_Liked_Resource
			WHERE usr_id=${usr_id} AND type_id=10
		) _ulr
		INNER JOIN ALBUMS _albums 
		ON _ulr.resource_id=_albums.album_id
		ORDER BY _ulr.ope_date DESC
	`; 
}

function getLikedArtists(usr_id) {
	return `
		SELECT 
		_artists.artist_id as id,
		_artists.artist_name as name,
		_artists.artist_pic_url as picUrl,
		(
			SELECT COUNT(*)
			FROM ALBUMS _albums 
			WHERE _albums.artist_id=_artists.artist_id
		) as albumSize 
		FROM (
			SELECT * 
			FROM Usr_Liked_Resource
			WHERE usr_id=${usr_id} AND type_id=100
		) _ulr
		INNER JOIN ARTISTS _artists 
		ON _ulr.resource_id=_artists.artist_id
		ORDER BY _ulr.ope_date DESC
	`;
}

function appendSongArtistQuery(song_id) {
	return `
		SELECT 
		_artists.artist_id as id, 
		_artists.artist_name as name
		FROM (
		SELECT * from Artist_Songs
		WHERE song_id=${song_id}
		) _as
		inner join ARTISTS _artists ON _artists.artist_id=_as.artist_id; 
	`
}

function appendAlbumQuery(album_id) {
	return `
		SELECT 
		album_name as name,
		type as type,
		publish_time as publishTime
		FROM ALBUMS WHERE album_id=${album_id};
	`;
}

function appendAlbumArtistQuery(artist_id) {
	return `
		SELECT 
		_artists.artist_id as id,
		_artists.artist_name as name
		FROM ARTISTS _artists 
		WHERE _artists.artist_id=${artist_id};
	`
}