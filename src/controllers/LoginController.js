const bcrypt = require('bcrypt');

function login(req, res) {
    if(req.session.loggedin != true){
        res.render('login/login');
    }
    else{
        res.redirect('/');
    }

  
}



function auth(req, res) {
    const data = req.body;
    console.log('hola mundo');
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [data.email], (err, rows) => {
            if (rows.length > 0) {
                rows.forEach(Element => {
                    bcrypt.compare(data.password, Element.password).then((result) => {
                        if (result) {
                            req.session.loggedin = true;
                            req.session.name = Element.nombre;
                            res.redirect('/');
                        } else {
                            console.log('Contraseña incorrecta');
                            res.render('login/login', {message: 'Contraseña incorrecta'});
                        }
                    });
                });
                    
            }
             else {
                console.log('Usuario no encontrado');
                res.render('login/login', {message: 'Usuario no encontrado'});
            }
        });
    });
}



function register(req, res) {
  if(req.session.loggedin != true){
    res.render('login/registro');
  }
    else{
        res.redirect('/');
    }
}

function storeUser(req, res) {
    const userData = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [userData.correo], (err, rows) => {
            if (rows.length > 0) {
                console.log('Usuario ya existe');
                res.render('login/registro', {message: 'El usuario ya existe'});
            } else {
                bcrypt.hash(userData.password,12).then((hash) => {
                    userData.password=hash;
                    console.log('Hash:', hash);
                    //eliminamos la confirmacion de la contraseña
                    delete userData.confirm_password;
                    console.log('User data:', userData);
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO usuarios SET ?', [userData], (err, rows) => {
                            console.log('Usuario registrado');
                            res.redirect('/');
                        });
                    });
                });
            }
        });
    });
}

function logout(req, res){
    if(req.session.loggedin){
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
    else{
        res.redirect('/login');
    }
}


module.exports = {
    login: login,
    register: register,
    storeUser: storeUser,
    auth: auth,
    logout: logout
};