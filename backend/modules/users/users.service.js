const UserSchema = require('./users.schema')

const getUsers = async (page, pageSize) => {
    const users = await UserSchema.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .populate('posts', 'title category')

    const totalUsers = await UserSchema.countDocuments()
    const totalPages = Math.ceil(totalUsers / pageSize)

    return {
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages,
        totalUsers,
        users,
    }
}

const getById = async (id) => {
    return UserSchema.findById(id)
}

const getByName = async (query) => {
    return UserSchema.find({
        firstName: {
            $regex: query,
            $options: 'i'
        }
    })
}

const findUsersFromEighteenToTwenty = async () => {
    return UserSchema.find({
        age: {
            $gte: 18,
            $lte: 20
        }
    })
}

const getAverageAge = async () => {
    return UserSchema.aggregate([
        { $group: { _id: null, averageAge: { $avg: "$age" } } },
    ])
}


const createUser = async (body) => {
    const newUser = new UserSchema(body)
    return await newUser.save()
}

const updateOne = async (id, body) => {
    return UserSchema.findByIdAndUpdate(id, body, { new: true })
}

const deleteOne = async (id) => {
    return UserSchema.findByIdAndDelete(id)
}

module.exports = {
    getUsers,
    getById,
    getByName,
    findUsersFromEighteenToTwenty,
    getAverageAge,
    createUser,
    updateOne,
    deleteOne,
}