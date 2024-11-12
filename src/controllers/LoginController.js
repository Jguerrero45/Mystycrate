function login(req, res) {
  res.render('login/login');
}

const bcrypt = require('bcrypt');

function auth(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [data.correo], (err, rows) => {
            if (rows.length > 0) {
                const user = rows[0];
                bcrypt.compare(data.password, user.password, (err, result) => {
                    if (result) {
                        req.session.user = user;
                        res.redirect('/');
                    } else {
                        res.render('login/login', {message: 'Contraseña incorrecta'});
                    }
                });
            } else {
                res.render('login/login', {message: 'Usuario no encontrado'});
            }
        });
    });
}



function register(req, res) {
  res.render('login/registro');
}

function storeUser(req, res) {
    const userData = req.body;
    console.log('User data:', userData);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [userData.correo], (err, rows) => {
            if (rows.length > 0) {
                console.log('Usuario ya existe');
                res.render('login/registro', {message: 'El usuario ya existe'});
            } else {
                bcrypt.hash(userData.password, 10, (err, hash) => {
                    userData.password = hash;
                    conn.query('INSERT INTO usuarios SET ?', [userData], (err, rows) => {
                        res.redirect('/login');
                    });
                });
            }
        });
    });
}


module.exports = {
    login: login,
    register: register,
    storeUser: storeUser
};