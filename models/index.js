const {Comment} = require('./Comment')
const {Like} = require('./Like')
const {Post} = require('./Post')
const {Profile} = require('./Profile')
const {User} = require('./User')


User.belongsToMany(Like, { through: 'UserLike' })
Like.belongsToMany(User, { through: 'UserLike' })

User.hasOne(Profile)
Profile.belongsTo(User)

User.hasMany(Post)
Post.belongsTo(User)

Post.hasMany(Comment)
Comment.belongsTo(Post)



module.exports = {
	Comment,
	Like,
	Post,
	Profile,
	User
}
