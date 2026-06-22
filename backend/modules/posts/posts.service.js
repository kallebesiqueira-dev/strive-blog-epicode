const PostSchema = require('./posts.schema')
const UserSchema = require('../users/users.schema')

const findAll = async (page, pageSize) => {
    const posts = await PostSchema.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .populate('author', 'firstName lastName avatar')

    const totalPosts = await PostSchema.countDocuments()
    const totalPages = Math.ceil(totalPosts / pageSize)

    return {
        posts,
        totalPosts,
        totalPages
    }
}

const findOne = async (id) => {
    return PostSchema.findById(id).populate('author', 'firstName lastName avatar')
}

const create = async (body) => {
    const postToCreate = new PostSchema(body)
    const savedPost = await postToCreate.save()
    await UserSchema.updateOne({ _id: body.author }, { $push: { posts: savedPost } })

    return savedPost
}

const update = async (id, body) => {
    const options = { new: true }
    return PostSchema.findByIdAndUpdate(id, body, options)
}

const deleteOne = async (id) => {
    const deletedPost = await PostSchema.findByIdAndDelete(id)

    if (!deletedPost) {
        return null
    }

    await UserSchema.findByIdAndUpdate(
        deletedPost.author,
        { $pull: { posts: deletedPost._id } },
        { new: true }
    )

    return deletedPost
}

module.exports = {
    findAll,
    findOne,
    create,
    update,
    deleteOne,
}