require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./db');
const models = require('./models/models');
const router = require('./router/index');

const PORT = process.env.PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router)

const start = async () => {
    try{ 
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => {console.log(`server is started on port ${PORT}`)})
    } catch(e) {
        console.log(e)
    }
}

start()