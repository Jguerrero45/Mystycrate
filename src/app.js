const express = require('express');
const multer = require('multer');
const myconnection = require('express-myconnection');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const loginRoutes = require('./routes/Login');
const perfilRoutes = require('./routes/perfil');
const categoriasRoutes = require('./routes/productos');
app.set('port', process.env.PORT || 4000);
const path = require('path');
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '45220220',
    port: 3306,
    database: 'mystycrate'
}, 'single'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/', loginRoutes);

app.use('/perfil', perfilRoutes);

app.use('/categorias', categoriasRoutes);

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        console.log(req.session.correo);
        res.render('index', { name: req.session.name, foto: req.session.userImage, correo: req.session.correo });
    } else {

        res.render('index');
    }
});

app.set('view engine', 'ejs');

