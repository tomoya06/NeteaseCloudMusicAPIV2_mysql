const { queryDBresponse, queryDBpromise, saveCharacter } = require(`${__dirname}/../util/database.js`)

module.exports = async (req, res, createWebAPIRequest, request) => {

	const type = req.query.type || '1';
	const keywords = saveCharacter(req.query.keywords || ' ');
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	const reg = `'${keywords.split(' ').join('.*')}'`

	if (type == '1') {

		const baseSql = `
			select 
			_songs.song_id as id, 
			_songs.song_name as name,
			_albums.album_id as album_id
			from SONGS _songs 
			left join ALBUMS _albums on _songs.album_id=_albums.album_id
			join Artist_Songs _as on _songs.song_id=_as.song_id
			join ARTISTS _artists on _as.artist_id=_artists.artist_id
			WHERE 
			CONCAT(_songs.song_name, ' ', _albums.album_name, ' ', _artists.artist_name) 
			REGEXP ${reg}
			limit ${limit} offset ${limit*offset};
		`;

		let _songs = await queryDBpromise(baseSql);

		// console.log(_songs);

		const _cnt = _songs.length;
		let curCnt = 0;

		const queryDone = function() {
			curCnt++
			// console.log(curCnt, _cnt);
			if (curCnt>=2*_cnt) {
				res.send({
					result: {
						songs: _songs
					},
					code: 200,
				})
			}
		}

		if (_cnt===0) {
			queryDone();
			return;
		}

		_songs.forEach((song) => {
			const curId = song.id;
			const curArtistSql = appendSongArtistQuery(curId);
			const curAlbumSql = appendAlbumQuery(song.album_id);

			queryDBpromise(curAlbumSql)
				.then((results) => {
					song.album=results[0];
					queryDone();
				})
				.catch((error) => {
					song.album={};
					queryDone();
				})

			queryDBpromise(curArtistSql)
				.then((results) => {
					song.artists=results;
					queryDone();
				})
				.catch((error) => {
					// console.log(error);
					song.artists=[];
					queryDone();
				})
		})
	}

	else if (type == '10') {

		const baseSql = `
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
			FROM ALBUMS _albums 
			left join ARTISTS _artists on _albums.artist_id=_artists.artist_id
			WHERE concat(_albums.album_name, ' ', _artists.artist_name) REGEXP ${reg}
			ORDER BY publishTime DESC
			limit ${limit} offset ${offset}
		`;

		const _albums = await queryDBpromise(baseSql);

		// console.log(_albums);

		const albumsCnt = _albums.length;
		let curCnt = 0;

		const queryDone = () => {
			curCnt++;
			if (curCnt>=albumsCnt) {

				res.send({
					result: {
						albums: _albums
					},
					code: 200,
				})

			}
		}

		if (albumsCnt===0) {
			queryDone();
			return;
		}

		_albums.forEach((album) => {
			queryDBpromise(appendAlbumArtistQuery(album.artist_id))
				.then((result) => {
					album.artist = result;
					queryDone();
				})
				.catch((error) => {
					album.artist = {};
					queryDone();
				})
		})

	}

	else if (type == '100') {

		const baseSql = `
			SELECT 
			_artists.artist_id as id,
			_artists.artist_name as name,
			_artists.artist_pic_url as picUrl,
			(
				SELECT COUNT(*)
				FROM ALBUMS _albums 
				WHERE _albums.artist_id=_artists.artist_id
			) as albumSize 
			FROM ARTISTS _artists 
			WHERE _artists.artist_name REGEXP ${reg}
			limit ${limit} offset ${offset}
		`;

		const _artists = await queryDBpromise(baseSql);

		// console.log(_artists);

		res.send({
			result: {
				artists: _artists
			},
			code: 200,
		})

	}

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

function appendAlbumQuery(album_id) {
	return `
		SELECT 
		album_name as name,
		type as type,
		publish_time as publishTime
		FROM ALBUMS WHERE album_id=${album_id};
	`;
}
