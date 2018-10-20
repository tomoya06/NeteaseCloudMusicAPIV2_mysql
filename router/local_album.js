const { queryDBpromise } = require(`${__dirname}/../util/database.js`)

module.exports = async (req, res, createWebAPIRequest, request) => {

	const album_id = req.query.id;
	if (!album_id) {
		res.status(400).send({
			message: 'Album id is required',
			code: 400,
		})
		return;
	}

	const result = {};

	const albumBaseInfo = (await queryDBpromise(getAlbumQuery(album_id)))[0];
	albumBaseInfo.artist = (await queryDBpromise(appendAlbumArtistQuery(albumBaseInfo.artist_id)))[0];

	const songs = await queryDBpromise(appendAlbumSongsQuery(album_id));

	const songsCnt = songs.length;
	let curCnt = 0;

	const queryDone = () => {
		curCnt++;
		if (curCnt>=songsCnt) {
			res.send({
				album: albumBaseInfo,
				songs,
				code: 200,
			})
		}
	}

	songs.forEach((song) => {
		queryDBpromise(appendSongArtistQuery(song.id))
			.then((result) => {
				song.ar = result;
				appendDensedAlbumToSong(albumBaseInfo, song);
				queryDone();
			})
			.catch((error) => {
				song.ar = [];
				appendDensedAlbumToSong(albumBaseInfo, song);
				queryDone();
			})
	})

}

function appendDensedAlbumToSong(albumInfo, song) {
	song.al = {
		id: albumInfo.id,
		name: albumInfo.name,
	}
}

function getAlbumQuery(album_id) {
	return `
		SELECT 
		_albums.album_name as name,
		_albums.album_id as id,
		_albums.album_pic_url as picUrl,
		_albums.description as description,
		_albums.artist_id as artist_id,
		(
			SELECT COUNT(*)
			FROM SONGS WHERE SONGS.album_id=${album_id}
		) as size,
		_albums.type as type,
		_albums.publish_time as publishTime
		FROM ALBUMS _albums 
		WHERE _albums.album_id=${album_id}
	`;
}

function appendAlbumSongsQuery(album_id) {
	return `
		SELECT 
		_songs.song_id as id,
		_songs.song_name as name
		FROM SONGS _songs 
		WHERE _songs.album_id=${album_id}
	`
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

function appendAlbumArtistQuery(artist_id) {
	return `
		SELECT 
		_artists.artist_id as id,
		_artists.artist_name as name
		FROM ARTISTS _artists 
		WHERE _artists.artist_id=${artist_id}
		LIMIT 1;
	`
}


