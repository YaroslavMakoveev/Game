require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Users} = require('../models/models');

const generadeJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
};

class UserController {
    async registration(req, res) {
        const {email, login, password, role} = req.body;
        try{
            const existingUserByEmail = await Users.findOne({where: {email}})
            if(existingUserByEmail) {
                return res.status(400).json({message: 'Пользователь с таким email уже зарегистрирован'})
            }
            const existingUserByLogin = await Users.findOne({where: {login}})
            if(existingUserByLogin) {
                return res.status(400).json({message: 'Пользователь с таким login уже зарегистрирован'})
            }
            const  hashedPassword = await bcrypt.hash(password, 5);
            const user = await Users.create({
                email, login, password: hashedPassword, role
            })
            const token = generadeJwt(user.id, user.email, user.role)
            return res.status(200).json({message: 'Пользователь успешно зарегистрирован', user, token})
        } catch(e) {
            console.log(e);
            return res.status(500).json({message: 'Ошибка сервера'})
        }
    }

    async login(req, res) {
        const {email, login, password} = req.body;
        try{
            let user;
            if(email) {
                user = await Users.findOne({where: {email}})
            }
            if(login) {
                user = await Users.findOne({where: {login}})
            } else {
                return res.status(404).json({message: 'Пользователь с такими данными не найден'})
            }
            
            if(!user) {
                return res.status(404).json({message: 'Пользователь с такими данными не найден'})
            }

            const comparePassword = await bcrypt.compare(password, user.password)
            if(!comparePassword) {
                return res.status(402).json({message: 'Неверный пароль'})
            }
            const token = generadeJwt(user.id, user.email, user.role)
            return res.status(200).json({message: 'Пользователь успешно зарегистрирован', user, token, role: user.role})
        } catch(e) {
            console.log(e);
            return res.status(500).json({message: 'Ошибка сервера'})
        }
    }

    async check(req, res) {
        const token = generadeJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController