function golosinas(req, res) {
    res.render('productos/golosinas');
}



function mostrarInventarioGolosinas(req, res) {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        }
        conn.query('SELECT * FROM productos_generales INNER JOIN productos_golosinas ON productos_generales.id_producto = productos_golosinas.id_producto', (err, rows) => {
            if (err) {
                res.json(err);
            }

            // Convertir el buffer de imagen a base64 para cada producto
            rows.forEach(row => {
                if (row.foto) {
                    row.foto = Buffer.from(row.foto).toString('base64');
                    row.foto = `data:image/jpeg;base64,${row.foto}`; // O ajusta el tipo de imagen según sea necesario
                }
            });

            res.render('productos/vista_productos_generales', {
                data: rows
            });
        });
    });
}


function registrargolosina(req, res) {
    const golosinaData = req.body;
    if (req.file) {
        golosinaData.foto = req.file.buffer
    }
    // Promesa para verificar si la golosina ya existe
    const verificarGolosinaExistente = () => {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                conn.query('SELECT * FROM productos_generales WHERE nombre_producto = ?', [golosinaData.nombre], (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            });
        });
    };

    // Promesa para insertar el producto en productos_generales
    const insertarProductoGenerales = () => {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                conn.query('INSERT INTO productos_generales (nombre_producto, descripcion, precio, categoria, stock, foto, peso) VALUES (?,?,?,?,?,?,?)',
                    [golosinaData.nombre, golosinaData.descripcion, golosinaData.precio, "golosinas", golosinaData.stock, golosinaData.foto, golosinaData.peso], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows.insertId);  // Devuelve el ID del producto insertado
                    });
            });
        });
    };

    // Promesa para insertar el producto en productos_golosinas
    const insertarProductoGolosinas = (id) => {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                conn.query('INSERT INTO productos_golosinas (id_producto, tipo_golosina, sabor, contenido_calorico, fecha_expiracion) VALUES (?,?,?,?,?)',
                    [id, golosinaData.tipo, golosinaData.sabor, golosinaData.calorias, golosinaData.fecha_expiracion], (err, rows) => {
                        if (err) reject(err);
                        resolve();
                    });
            });
        });
    };

    // Inicia el proceso de registro
    verificarGolosinaExistente()
        .then(rows => {
            if (rows.length > 0) {
                console.log('Golosina ya existe');
                res.render('productos/golosinas', {message: 'La golosina ya existe'});
            } else {
                if (req.file) {
                    golosinaData.foto = req.file.buffer;
                }
                // Primero inserta el producto en productos_generales
                return insertarProductoGenerales();
            }
        })
        .then(id => {
            // Luego inserta la golosina en productos_golosinas
            return insertarProductoGolosinas(id);
        })
        .then(() => {
            console.log('Golosina registrada correctamente');
            res.redirect('/');  // Redirige después de registrar ambos productos
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Hubo un error al registrar la golosina');
        });
}


module.exports = {
    golosinas,
    registrargolosina,
    mostrarInventarioGolosinas,
}