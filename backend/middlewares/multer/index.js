const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'EPICODE-0425',
        format: async (req, file) => 'jpg',
        public_id: (req, file) => file.name
    }
})

const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const fileExtension = file.originalname.split('.').pop()
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)
    }
})

const upload = multer({ storage: internalStorage })
const cloud = multer({ storage: cloudStorage })

module.exports = {
    upload,
    cloud,
}