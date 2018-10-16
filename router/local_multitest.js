const legitColumns = require(`${__dirname}/../sql-query/legitColumns.json`)
const { multyQueryDBresponse } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const selectSong = 'select * from song'
	const selectArtist = 'select * from artist'

	multyQueryDBresponse(res, {
		songs: selectSong,
		artists: selectArtist,
	})

}