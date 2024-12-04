function obtenerusuario(req, res) {
    console.log('Obteniendo usuario:', req.params.correo);

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send('Error de conexión con la base de datos.');
        }

        conn.query('SELECT * FROM usuarios WHERE correo = ?', [req.params.correo], (err, rows) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).send('Error al obtener el usuario.');
            }

            if (rows.length === 0) {
                return res.status(404).send('Usuario no encontrado.');
            }

            const usuario = rows[0];

            // Convertir el buffer de la imagen a base64 si existe
            if (usuario.foto && Buffer.isBuffer(usuario.foto)) {
                usuario.foto = `data:image/jpeg;base64,${usuario.foto.toString('base64')}`;
            }

            // Convertir la fecha de nacimiento a formato YYYY-MM-DD
            if (usuario.fecha_nacimiento) {
                const fecha = new Date(usuario.fecha_nacimiento);
                // Asegurarse de que la fecha sea válida antes de formatearla
                if (!isNaN(fecha)) {
                    usuario.fecha_nacimiento = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                }
            }

            console.log('Usuario:', usuario);

            // Renderizar la vista con los datos del usuario
            res.render('perfil/Perfil', { data: usuario });
        });
    });
}

function obtenercajas(req, res) {
    console.log('Obteniendo cajas del usuario:', req.params.correo);

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send('Error de conexión con la base de datos.');
        }
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [req.params.correo], (err, rows) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).send('Error al obtener el usuario.');
            }
            if (rows.length === 0) {
                return res.status(404).send('Usuario no encontrado.');
            }
            const usuario = rows[0];
            console.log('Usuario encontrado:', usuario.id_usuario);

            // Obtener las cajas del usuario
            conn.query('SELECT * FROM cajas_misteriosas WHERE id_usuario = ?', [usuario.id_usuario], (err, cajas) => {
                if (err) {
                    console.error('Error al ejecutar la consulta de cajas:', err);
                    return res.status(500).send('Error al obtener las cajas.');
                }
                console.log('Cajas:', cajas);

                // Obtener los productos asociados a las cajas
                conn.query('SELECT * FROM productos_caja WHERE id_caja IN (?)', [cajas.map(row => row.id_caja)], (err, productosCaja) => {
                    if (err) {
                        console.error('Error al ejecutar la consulta de productos_caja:', err);
                        return res.status(500).send('Error al obtener los productos de las cajas.');
                    }
                    console.log('Productos de las cajas:', productosCaja);

                    // Obtener los productos generales asociados a los productos de las cajas
                    conn.query('SELECT * FROM productos_generales WHERE id_producto IN (?)', [productosCaja.map(row => row.id_producto)], (err, productosGenerales) => {
                        if (err) {
                            console.error('Error al ejecutar la consulta de productos_generales:', err);
                            return res.status(500).send('Error al obtener los productos generales.');
                        }

                        // Convertir el atributo 'foto' de Buffer a URL Base64
                        productosGenerales.forEach(producto => {
                            if (producto.foto) {
                                // Convertir el Buffer a Base64 y asignar la URL
                                producto.foto = `data:image/png;base64,${producto.foto.toString('base64')}`;
                            }
                        });

                        // Renderizar la vista con los productos generales y sus imágenes convertidas
                        res.render('productos/vista_productos_generales', {data: productosGenerales });
                    });
                });
            });
        });
    });
}





function modificarusuario(req, res) {

    console.log('Modificando usuario:', req.params.correo);
    req.getConnection((err, conn) => {
        if (err){
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send('Error de conexión con la base de datos.');
        }
        conn.query('SELECT * FROM usuarios WHERE correo = ?', [req.params.correo], (err, rows) => {
            if (err){
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).send('Error al obtener el usuario.');
            }
            if (rows.length === 0){
                return res.status(404).send('Usuario no encontrado.');
            }
            const usuario = rows[0];
            if (usuario.fecha_nacimiento){
                const fecha = new Date(usuario.fecha_nacimiento);
                if (!isNaN(fecha)){
                    usuario.fecha_nacimiento = fecha.toISOString().split('T')[0];
                }
            }
            if (req.file){
                usuario.foto = req.file.buffer;
            }
            console.log('Usuario:', usuario);
            conn.query('UPDATE usuarios SET nombre = ?, apellido = ?, fecha_nacimiento = ?, foto = ? WHERE correo = ?', [req.body.nombre, req.body.apellido, req.body.fecha_nacimiento, usuario.foto, req.params.correo], (err, result) => {
                if (err){
                    console.error('Error al ejecutar la consulta:', err);
                    return res.status(500).send('Error al modificar el usuario.');
                }
                if (result.affectedRows > 0){
                    console.log('Usuario modificado exitosamente');
                    res.redirect('/');
                } else {
                    console.log('Usuario no encontrado');
                    res.status(404).send('Usuario no encontrado');
                }
            });
        });
    }
    );
}

function eliminarusuario(req, res) {
    const userId = req.params.correo; // Se obtiene el ID del usuario desde los parámetros de la ruta
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            res.status(500).send('Error al conectar a la base de datos');
            return;
        }

        // Realiza la consulta para eliminar al usuario con el ID proporcionado
        conn.query('DELETE FROM usuarios WHERE correo = ?', [userId], (err, result) => {
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
        

module.exports = {
    obtenerusuario,
    modificarusuario,
    eliminarusuario,
    obtenercajas
};
