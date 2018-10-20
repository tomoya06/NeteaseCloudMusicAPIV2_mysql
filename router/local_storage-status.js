const { queryDBpromise } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const sqls = extractQuerySqls();
	const cnt = Object.keys(sqls).length;
	const _result = {};

	let curCnt = 0;

	const queryDone = () => {
		curCnt++;
		if (curCnt==cnt) {
			res.send({
				..._result,
				code: 200,
			})
		}
	}

	Object.keys(sqls).forEach((key) => {
		queryDBpromise(sqls[key])
			.then(([error, results]) => {
				if (!error) {
					_result[key] = results[0][Object.keys(results[0])[0]]
				} else {
					_result[key] = 0;
				}
				queryDone();
			})
	})


}

function extractQuerySqls() {
	return {
		songs_cnt: `SELECT COUNT(*) FROM SONGS;`,
		albums_cnt: `SELECT COUNT(*) FROM ALBUMS;`,
		artists_cnt: `SELECT COUNT(*) FROM ARTISTS;`,
		playlists_cnt: `SELECT COUNT(*) FROM PLAYLISTS;`,
		usrs_cnt: `SELECT COUNT(*) FROM USRS;`,
	}
}