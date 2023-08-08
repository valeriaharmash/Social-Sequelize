const { Comment, Like, Post, Profile, User } = require('./index')
const { db } = require('./db/connection.js')

let user
let profile
let post
let comment
let like

beforeAll(async () => {
	// the 'sync' method will create tables based on the model class
	// by setting 'force:true' the tables are recreated each time the test suite is run
	await db.sync({ force: true })
	user = await User.create({
		username: 'CoolUser',
		email: 'test@gmail.com'
	})

	profile = await Profile.create({
		bio: 'I am a user',
		profilePicture: 'test.jpg',
		birthday: '1990-06-15'
	})

	post = await Post.create({
		title: 'Pool party',
		body: 'Had fun',
		createdAt: '2023-04-13'
	})

	comment = await Comment.create({
		body: 'Great pic',
		createdAt: '2021-03-13'
	})

	like = await Like.create({
		reactionType: '😂',
		createdAt: '2028-03-19'
	})
})

describe('User', () => {
	it('has expected properties', async () => {
		expect(user).toHaveProperty('id')
		expect(user).toHaveProperty('username')
		expect(user).toHaveProperty('email')
	})

	it('has correct datatypes for properties', () => {
		expect(typeof user.username).toBe('string')
		expect(typeof user.email).toBe('string')
	})

	it('assignes correct values to properties', async () => {
		expect(user.username).toBe('CoolUser')
		expect(user.email).toBe('test@gmail.com')
	})

	it('can update User', async () => {
		user.update({ username: 'Frodo' })
		expect(user.username).toBe('Frodo')
	})

	it('can delete User', async () => {
		const allUsersBeforeDelete = await User.findAll()
		expect(allUsersBeforeDelete.length).toEqual(1)

		await user.destroy()

		const allUsersAfterDelete = await User.findAll()
		expect(allUsersAfterDelete.length).toEqual(0)
	})

	it('User can only have one profile', async () => {
		const newUser = await User.create({
			username: 'CoolUser2',
			email: 'test2@gmail.com'
		})

		const newProfile = await Profile.create({
			bio: 'I am a new user',
			profilePicture: 'test2.jpg',
			birthday: '2000-06-15'
		})

		await newUser.setProfile(newProfile)

		const associatedProfile = await newUser.getProfile()

		expect(associatedProfile instanceof Profile).toBeTruthy()
	})

	it('User can have many likes', async () => {
		const newUser2 = await User.create({
			username: 'CoolUser3',
			email: 'test3@gmail.com'
		})

		const newLike = await Like.create({
			reactionType: '😂',
			createdAt: '2029-03-19'
		})

		const newLike2 = await Like.create({
			reactionType: '👍',
			createdAt: '2024-03-19'
		})

		await newUser2.addLike(newLike)
		await newUser2.addLike(newLike2)

		const associatedLikes = await newUser2.getLikes()

		expect(associatedLikes.length).toBe(2)
		expect(associatedLikes instanceof Like).toBeTruthy
	})

	it('Likes can have many Users', async () => {
		const myLike = await Like.create({
			reactionType: '👍',
			createdAt: '2030-03-19'
		})

		const newUser4 = await User.create({
			username: 'CoolUser4',
			email: 'test4@gmail.com'
		})

		const newUser5 = await User.create({
			username: 'CoolUser5',
			email: 'test5@gmail.com'
		})

		await myLike.addUser(newUser4)
		await myLike.addUser(newUser5)

		const associatedUsers = await myLike.getUsers()

		expect(associatedUsers.length).toBe(2)
		expect(associatedUsers instanceof User).toBeTruthy
	})
})

describe('Profile', () => {
	it('has expected properties', async () => {
		expect(profile).toHaveProperty('id')
		expect(profile).toHaveProperty('bio')
		expect(profile).toHaveProperty('profilePicture')
		expect(profile).toHaveProperty('birthday')
	})

	it('has correct datatypes for properties', () => {
		expect(typeof profile.bio).toBe('string')
		expect(typeof profile.profilePicture).toBe('string')
		expect(typeof profile.birthday).toBe('string')
	})

	it('assignes correct values to properties', async () => {
		expect(profile.bio).toBe('I am a user')
	})

	it('can update Profile', async () => {
		profile.update({ birthday: '1999-10-03' })
		expect(profile.birthday).toBe('1999-10-03')
	})
})

describe('Post', () => {
	it('has expected properties', async () => {
		expect(post).toHaveProperty('id')
		expect(post).toHaveProperty('title')
		expect(post).toHaveProperty('body')
		expect(post).toHaveProperty('createdAt')
	})

	it('has correct datatypes for properties', () => {
		expect(typeof post.title).toBe('string')
		expect(typeof post.body).toBe('string')
		expect(typeof post.createdAt).toBe('string')
	})

	it('assignes correct values to properties', async () => {
		expect(post.title).toBe('Pool party')
	})

	it('can update Post', async () => {
		post.update({ body: 'Amazing day' })
		expect(post.body).toBe('Amazing day')
	})
})

describe('Comment', () => {
	it('has expected properties', async () => {
		expect(comment).toHaveProperty('id')
		expect(comment).toHaveProperty('body')
		expect(comment).toHaveProperty('createdAt')
	})

	it('has correct datatypes for properties', () => {
		expect(typeof comment.body).toBe('string')
		expect(typeof comment.createdAt).toBe('string')
	})

	it('assignes correct values to properties', async () => {
		expect(comment.body).toBe('Great pic')
	})

	it('can update Post', async () => {
		post.update({ body: 'I do not like it' })
		expect(post.body).toBe('I do not like it')
	})
})

describe('Like', () => {
	it('has expected properties', async () => {
		expect(like).toHaveProperty('id')
		expect(like).toHaveProperty('reactionType')
		expect(like).toHaveProperty('createdAt')
	})

	it('has correct datatypes for properties', () => {
		expect(typeof like.reactionType).toBe('string')
		expect(typeof like.createdAt).toBe('string')
	})

	it('assignes correct values to properties', async () => {
		expect(like.reactionType).toBe('😂')
	})

	it('can update Like', async () => {
		like.update({ reactionType: '👍' })
		expect(like.reactionType).toBe('👍')
	})
})
