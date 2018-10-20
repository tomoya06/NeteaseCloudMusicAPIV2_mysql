const { queryDBpromise } = require(`${__dirname}/../util/database.js`)

module.exports = async (req, res, createWebAPIRequest, request) => {

	const artist_id = req.query.id;

	if (!artist_id) {
		res.status(400).send({
			message: 'Artist id is required.',
			code: 400,
		})
		return;
	}

	const baseInfo = await queryDBpromise(getArtistBaseInfo(artist_id));

	const hotSongs = await queryDBpromise(appengHotSongs(artist_id));

	const songsCnt = hotSongs.length;
	let curCnt = 0;

	const queryDone = () => {
		curCnt++;
		if (curCnt==2*songsCnt) {
			res.send({
				artist: baseInfo,
				code: 200,
				hotSongs,
			})
		}
	}

	hotSongs.forEach((song) => {
		queryDBpromise(appendSongAlbumQuery(song.id))
			.then((result) => {
				song.al = result[0];
				queryDone();
			})
			.catch((error) => {
				song.ar = {};
				queryDone();
			})

		queryDBpromise(appendSongArtistQuery(song.id))
			.then((result) => {
				song.ar = result;
				queryDone();
			})
			.catch((error) => {
				song.ar = [];
				queryDone();
			})
	})


}

function getArtistBaseInfo(artist_id) {
	return `
		SELECT 
		artist_id as id,
		artist_name as name,
		artist_pic_url as picUrl,
		briefDesc,
		(
			SELECT COUNT(*)
			FROM Artist_Album
			WHERE artist_id=${artist_id}
		) as albumSize,
		(
			SELECT COUNT(*)
			FROM Artist_Songs
			WHERE artist_id=${artist_id}
		) as musicSize
		FROM ARTISTS  
		WHERE artist_id=${artist_id}
	`;
}

function appengHotSongs(artist_id) {
	return `
		SELECT 
		_songs.song_id as id,
		_songs.song_name as name,
		_songs.album_id
		FROM Artist_Songs _as 
		inner join SONGS _songs on _songs.song_id=_as.song_id
		left join ALBUMS _albums on _songs.album_id=_albums.album_id
		WHERE _as.artist_id=${artist_id} AND _songs.is_hot=1
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

function appendSongAlbumQuery(album_id) {
	return `
		SELECT 
		_albums.album_name as name,
		_albums.album_id as id
		FROM ALBUMS _albums 
		WHERE _albums.album_id=${album_id}
	`;
}