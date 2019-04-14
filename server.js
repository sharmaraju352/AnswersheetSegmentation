const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
var busboy = require('connect-busboy');
const users = require('./routes/api/users');
const segmentation = require('./routes/api/segmentation');
const config = require('./config/config');

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);
app.use(busboy());

//routes
app.use('/api/users', users);
app.use('/api/segmentation', segmentation);

//connect to mongoDB
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('mongodb connected'))
  .catch(err => console.log(err));

//test route
app.get('/', (req, res) => {
  res.send('It works!!');
});

//server static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));
