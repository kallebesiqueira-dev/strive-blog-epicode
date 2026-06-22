const CommentSchema = require('./comments.schema')
const PostSchema = require('../posts/posts.schema')

const getByPost = async (postId) => {
    const post = await PostSchema.findById(postId)
    if (!post) {
        return null
    }
    return CommentSchema.find({ post: postId }).populate('author', 'firstName lastName avatar')
}

const getOne = async (postId, commentId) => {
    return CommentSchema.findOne({ _id: commentId, post: postId })
        .populate('author', 'firstName lastName avatar')
}

const create = async (postId, body) => {
    const post = await PostSchema.findById(postId)
    if (!post) {
        return null
    }

    const comment = await CommentSchema.create({ ...body, post: postId })
    await PostSchema.findByIdAndUpdate(postId, { $push: { comments: comment._id } })

    return comment
}

const update = async (postId, commentId, body) => {
    return CommentSchema.findOneAndUpdate(
        { _id: commentId, post: postId },
        body,
        { new: true }
    )
}

const remove = async (postId, commentId) => {
    const deleted = await CommentSchema.findOneAndDelete({ _id: commentId, post: postId })
    if (!deleted) {
        return null
    }

    await PostSchema.findByIdAndUpdate(postId, { $pull: { comments: commentId } })
    return deleted
}

module.exports = {
    getByPost,
    getOne,
    create,
    update,
    remove,
}
