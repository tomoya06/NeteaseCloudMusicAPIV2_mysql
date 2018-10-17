const { multyQueryDBresponse } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	multyQueryDBresponse(res, extractQuerySql())

}

function extractQuerySql() {
	return {
		songs_cnt: `SELECT COUNT(*) FROM SONGS;`,
		albums_cnt: `SELECT COUNT(*) FROM ALBUMS;`,
		artists_cnt: `SELECT COUNT(*) FROM ARTISTS;`,
		playlists_cnt: `SELECT COUNT(*) FROM PLAYLISTS;`,
		usrs_cnt: `SELECT COUNT(*) FROM USRS;`,
	}
}