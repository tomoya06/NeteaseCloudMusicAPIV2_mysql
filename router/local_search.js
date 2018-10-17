const { queryDBresponse } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const type = req.query.type || '1';
	const keywords = req.query.keywords;
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	if (!keywords) {
		res.status(400).send({
			message: 'no keywords',
			code: 400
		})
		return ;
	}

	const sql = extractQuerySql(type, keywords, limit, offset);
	queryDBresponse(res, sql)

}

function extractQuerySql(type, keywords, limit, offset) {

	let columnName, dbName, typeName;
	switch (type) {
		case '1': typeName = 'song'; break;
		case '10': typeName = 'album'; break;
		case '100': typeName = 'artist'; break;
		case '1000': typeName = 'playlist'; break;
		default: break;
	}

	columnName = typeName+'_name';
	idColumnName = typeName+'_id';
	dbName = typeName.toUpperCase()+'S';

	const reg = `${keywords.split(' ').join('.*')}`

	// TODO: advanced search pattern
	return `
		SELECT * FROM ${dbName}
		WHERE ${columnName} 
		REGEXP '${reg}'
		LIMIT ${limit}
		OFFSET ${limit*offset};
	`

}
