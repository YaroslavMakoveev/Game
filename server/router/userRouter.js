const Router = require('express');
const userController = require('../controllers/userController');
const check = require('../middleware/authmiddleware')

const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', check, userController.check)

module.exports = router