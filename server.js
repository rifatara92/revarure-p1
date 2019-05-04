const express = require('express');
const bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const multer = require('multer'); //Multer adds a body object and a file object to the request object. The body object contains the values of the text fields of the form, the file object contains the files uploaded via the form.
const upload = multer({ dest: './uploads/' });
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, '/uploads'); // join the path to the current directory
const port = 4000; // Define port for app to listen on
const app =  express();
const sequelize = require('sequelize');
app.use(logger('dev'));  // Creating a logger (using morgan)
app.use(bodyParser());  // to use bodyParser (for data transfer between client and server)
app.use(express.static('.'));  // making current directory as a static directory
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {    // GET / route for serving index.html file
   res.render('index.html');
});

app.get('/images', (req, res) => {
   fs.readdir(directoryPath, (err, files) => {
       if (err) {
         return res.json([]);
       }
       return res.json(files);
     });
});


app.post('/upload', upload.single('myFile'), (req, res) => {  // POST /upload for single file upload


   res.redirect('/')   // Redirecting back to the home local host:4000/

});

app.listen(port, () => {   // To make the server live
   console.log(`App is live on port ${port}`);
});


const psql = new sequelize('servername', 'useradmin', 'password', {
   host: 'maypsql.postgres.database.azure.com',
   dialect: 'postgres',
   dialectOptions: {
     ssl: true,
     options: {
       encrypt: true,
   }
  }
  });





