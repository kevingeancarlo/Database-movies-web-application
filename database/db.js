
async function consulta() {
    //Consulta optimizada
    const mysql = require('mysql2/promise');
    //Crear conexión
    const connection = await mysql.createConnection({
        host             : 'localhost',
        port             : '3306',
        user             : 'root',
        password         : '123456789',
        database         : 'videoclub',
    });

    connection.connect(function(err){
        if (err) {
            console.error('Error de conexion: ' + err.stack);
            return;
        }
        console.log('Conectado con el identificador ' + connection.threadId);
      });

    /* //Realizar query
    const [Filas, Campos] = await(connection.execute('SELECT * FROM clientes'));
    connection.end();
    return Filas;  */

}
module.exports = consulta();
