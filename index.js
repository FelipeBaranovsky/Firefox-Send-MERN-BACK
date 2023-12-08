const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//Create Server
const app = express();

//Connect to DB
connectDB();

//App Port
const port = process.env.PORT || 4000;

//Read values
app.use(express.json());

//CORS
const corsSettings = {
    origin: process.env.FRONTEND_URL
}

app.use(cors(corsSettings));

//Public Folder
app.use(express.static('uploads'));

//Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

//Server Start
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
});
