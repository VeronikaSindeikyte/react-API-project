import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import manoAPIroutes from './routes/manoAPIroutes.js';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'))


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));


mongoose.connect(process.env.URI)
    .then(result => app.listen(process.env.PORT, () => console.log('Server running on port', process.env.PORT)))
    .catch(err => console.log(err));

app.use('/api', manoAPIroutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.get('/AddProduct', (req, res) => res.render('AddProduct'))
