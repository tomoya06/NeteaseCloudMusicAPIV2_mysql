const { queryDBresponse } = require(`${__dirname}/../util/database.js`)

module.exports = (req, res, createWebAPIRequest, request) => {

	const usr_id = req.query.id;
	const type_id = req.query.type || "1";
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	const sql = extractQuerySql(usr_id, type_id, limit, offset);

	queryDBresponse(res, sql);
}

function extractQuerySql(usr_id, type_id, limit, offset) {

	let columnName, dbName, typeName;
	switch (type_id) {
		case '1': typeName = 'song'; break;
		case '10': typeName = 'album'; break;
		case '100': typeName = 'artist'; break;
		case '1000': typeName = 'playlist'; break;
		default: break;
	}

	columnName = typeName+'_name';
	idColumnName = typeName+'_id';
	dbName = typeName.toUpperCase()+'S';

	return `
		SELECT _resources.*, _likes.ope_date 
		FROM ${dbName} _resources 
		inner join 
		(SELECT * FROM Usr_Liked_Resource WHERE usr_id=${usr_id} AND type_id=${type_id}) _likes 
		ON _resources.${idColumnName}=_likes.resource_id
		ORDER BY _likes.ope_date DESC 
		limit ${limit} offset ${offset};
	`;
}