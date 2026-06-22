const { body, validationResult } = require('express-validator')

const userBodyValidation = [
    body('firstName')
        .notEmpty()
        .isString()
        .withMessage('FirstName must be a valid string and not empty'),
    body('lastName')
        .notEmpty()
        .isString()
        .withMessage('LastName must be a valid string and not empty'),
    body('email')
        .isEmail()
        .notEmpty()
        .withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty()
        .isString()
        .isLength({ min: 8 })
        .withMessage('Password must be a valid string'),
    body('dob')
        .isDate()
        .optional()
        .withMessage('Date of birth must be a valid date'),
    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid url'),
    body('age')
        .optional()
        .isInt()
        .withMessage('Age must be a valid integer number'),
]

const userBodyValidator = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400)
            .json({
                errors: errors.array()
            })
    }
    next()
}


module.exports = {
    userBodyValidator,
    userBodyValidation
}