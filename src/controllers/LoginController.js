const bcrypt = require('bcrypt');

function login(req, res) {
    if(req.session.loggedin != true){
        res.render('login/login');
    }
    else{
        res.redirect('/');
    }

  
}

function categorias(req, res) {
    res.render('login/categorias');
}

function eleccioncategorias(req, res) {
    id_usuario = req.params.id_usuario;
    id_plan = req.params.id_plan;
    res.redirect('/register/plans/categorias/'+id_usuario+'/'+id_plan+'/'+"pay");

}


const mysql = require('mysql2');

function realizarpago(req, res) {
    const data = req.body;
    const id_usuario = req.params.id_usuario;
    const id_plan = req.params.id_plan;
    const preferencia = req.params.preferencia;
    const tipo = req.params.tipo;
    const subtipo = req.params.subtipo;

    // Eliminar corchetes y convertir a array
    const arraytipo = tipo.replace(/[\[\]']/g, '').split(',');
    const arraysubtipo = subtipo.replace(/[\[\]']/g, '').split(',');

    delete data.Numerotarjeta;
    delete data.titular;
    delete data.fecha_venc;
    delete data.cvv;

    console.log('id_usuario:', id_usuario);
    console.log('id_plan:', id_plan);
    console.log('data:', data);

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }

        // Obtener el monto del plan
        conn.query('SELECT precio FROM planes WHERE id_plan = ?', [id_plan], (err, rows) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).send('Error al obtener el monto del plan');
            }

            if (rows.length === 0) {
                console.log('Plan no encontrado');
                return res.render('login/pagos', { message: 'Plan no encontrado' });
            }

            const monto = rows[0].precio;
            const pago = { usuario_id: id_usuario, id_plan: id_plan, monto, fecha_pago: new Date() };
            const cliente = { id_cliente: id_usuario, direccion: data.Direccion };

            // Insertar pago
            conn.query('INSERT INTO pagos SET ?', pago, (err) => {
                if (err) {
                    console.error('Error al realizar el pago:', err);
                    return res.status(500).send('Error al realizar el pago');
                }

                // Insertar cliente
                conn.query('INSERT INTO clientes SET ?', cliente, (err) => {
                    if (err) {
                        console.error('Error al registrar cliente:', err);
                        return res.status(500).send('Error al registrar cliente');
                    }

                    if (preferencia === 'golosinas') {
                        const condicionesSabores = arraysubtipo.map(sabor => `pg.sabor LIKE '%${sabor}%'`).join(' OR ');
                        const consultaSQL = `
                            SELECT DISTINCT pg_gen.id_producto, pg_gen.nombre_producto, pg_gen.descripcion, pg_gen.precio, pg_gen.stock, pg.sabor, pg.tipo_golosina
                            FROM productos_generales pg_gen
                            JOIN productos_golosinas pg ON pg_gen.id_producto = pg.id_producto
                            WHERE pg.tipo_golosina = ?
                            AND (${condicionesSabores})
                            AND pg_gen.stock > 0
                            ORDER BY RAND()
                            LIMIT 5;
                        `;

                        conn.query(consultaSQL, arraytipo, (err, productos) => {
                            if (err) {
                                console.error('Error en la consulta:', err);
                                return;
                            }

                            // Actualizar el stock de los productos seleccionados
                            let productoCount = productos.length;
                            productos.forEach((producto, index) => {
                                const nuevoStock = producto.stock - 1;

                                if (nuevoStock >= 0) {
                                    conn.query(
                                        `UPDATE productos_generales SET stock = ? WHERE id_producto = ?`,
                                        [nuevoStock, producto.id_producto],
                                        (err) => {
                                            if (err) {
                                                console.error('Error al actualizar stock:', err);
                                            }
                                            // Si es el último producto, entonces enviar respuesta
                                            if (index === productoCount - 1) {
                                                req.session.loggedin = true;
                                                console.log('Pago realizado con éxito');
                                                res.redirect('/');
                                            }
                                        }
                                    );
                                } else {
                                    console.log(`Stock insuficiente para el producto ${producto.id_producto}`);
                                    // Si es el último producto, enviar respuesta
                                    if (index === productoCount - 1) {
                                        req.session.loggedin = true;
                                        console.log('Pago realizado con éxito');
                                        res.redirect('/');
                                    }
                                }
                            });
                        });
                    } else {
                        // Si no es golosinas, redirigir
                        req.session.loggedin = true;
                        console.log('Pago realizado con éxito');
                        res.redirect('/');
                    }
                });
            });
        });
    });
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
                            req.session.correo = Element.correo;
                            console.log(req.session.correo);
                            if(Element.foto != null){
                                req.session.userImage = Element.foto.toString('base64');
                            }
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


function eliminar(req, res) {
    const userId = req.params.id; // Se obtiene el ID del usuario desde los parámetros de la ruta
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).send('Error al conectar a la base de datos');
            return;
        }

        // Realiza la consulta para eliminar al usuario con el ID proporcionado
        conn.query('DELETE FROM usuarios WHERE usuario_id = ?', [userId], (err, result) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                res.status(500).send('Error al ejecutar la consulta');
                return;
            }

            // Verifica si se eliminó algún registro
            if (result.affectedRows > 0) {
                console.log(`Usuario con ID ${userId} eliminado exitosamente`);
                res.redirect('/');
            } else {
                console.log(`Usuario con ID ${userId} no encontrado`);
                res.status(404).render('error', { message: 'Usuario no encontrado' });
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

function plans(req,res){
    res.render("login/suscripciones")
}

function pay(req,res){
    res.render("login/pagos")
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
                    if (req.file) {
                        userData.foto = req.file.buffer;
                    }
                    userData.password=hash;
                    console.log('Hash:', hash);
                    //eliminamos la confirmacion de la contraseña
                    delete userData.confirm_password;
                    console.log('User data:', userData);
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO usuarios SET ?', [userData], (err, rows) => {
                            console.log('Usuario registrado');
                            console.log(userData.nombre);
                            req.session.name = userData.nombre;
                            res.redirect('/register/plans/'+rows.insertId);
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
            res.redirect('/');
        });
    }
    else{
        res.redirect('/');
    }
}


module.exports = {
    login: login,
    register: register,
    storeUser: storeUser,
    auth: auth,
    logout: logout,
    plans: plans,
    pay: pay,
    eliminar: eliminar,
    realizarpago: realizarpago,
    categorias: categorias,
    eleccioncategorias: eleccioncategorias
};