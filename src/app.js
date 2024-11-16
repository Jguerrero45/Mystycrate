const express = require('express');

const myconnection = require('express-myconnection');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const loginRoutes = require('./routes/Login');  
app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
app.use(express.static('public'));
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: 3306,
    database: 'mystycrate'
}, 'single'));


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/', loginRoutes);

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {name: req.session.name});
    } else {
        res.redirect('/login');
    }
});

app.set('view engine', 'ejs');

