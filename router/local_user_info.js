const { queryDBpromise } = require(`${__dirname}/../util/database.js`)

module.exports = async (req, res, createWebAPIRequest, request) => {

	const userId = req.query.id;
	if (!userId) {
		res.status(403).send({
			message: 'User ID is requried',
			code: 403,
		})
		return;
	}
	const [error, results] = await queryDBpromise(getUserInfoQuery(userId))
	
	if (error) {
		res.status(503).send({
			message: error,
			code: 503,
		})
		return;
	} else {
		const userInfo = results[0]
		res.send({
			id: userId,
			info: userInfo,
			code: 200,
		})
		return;
	}
}

function getUserInfoQuery(userId) {
	return `
		SELECT 
		usr_id as id,
		nickname,
		gender,
		birthday,
		province,
		city,
		avatar_url as avatarUrl,
		create_time as createTime
		FROM USRS
		WHERE usr_id=${userId}
	`;
}