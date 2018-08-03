var mysql = require('mysql');
// port = process.env.PORT || 4205;

// if (port == 4205) {
    /*var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'proyectopaypal',
        multipleStatements: true,
        insecureAuth: true,
        // Con este atributo se Castean todos los campos del tipo BIT a BOOLEAN
        typeCast: function castField(field, useDefaultTypeCasting ) {

            // We only want to cast bit fields that have a single-bit in them. If the field
            // has more than one bit, then we cannot assume it is supposed to be a Boolean.
            if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                var bytes = field.buffer();

                // A Buffer in Node represents a collection of 8-bit unsigned integers.
                // Therefore, our single "bit field" comes back as the bits '0000 0001',
                // which is equivalent to the number 1.
                return( bytes[ 0 ] === 1 );
            }

            return( useDefaultTypeCasting() );
        }
    });*/
    var connection = mysql.createConnection({
        host: 'cursosutm.mysql.database.azure.com',
        port: 3306,
        user: 'Santiago@cursosutm',
        password: 'Alpha281295@',
        database: 'proyectopaypal',
        multipleStatements: true,
        insecureAuth: true,
        // Con este atributo se Castean todos los campos del tipo BIT a BOOLEAN
        typeCast: function castField(field, useDefaultTypeCasting ) {

            // We only want to cast bit fields that have a single-bit in them. If the field
            // has more than one bit, then we cannot assume it is supposed to be a Boolean.
            if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                var bytes = field.buffer();

                // A Buffer in Node represents a collection of 8-bit unsigned integers.
                // Therefore, our single "bit field" comes back as the bits '0000 0001',
                // which is equivalent to the number 1.
                return( bytes[ 0 ] === 1 );
            }

            return( useDefaultTypeCasting() );
        }
    });

    /*var connection = mysql.createConnection({
        host: 'den1.mysql6.gear.host',
        port: 3306,
        user: 'tiendacursos',
        password: 'Xa5883ZXT~i-',
        database: 'tiendacursos',
        multipleStatements: true,
        insecureAuth: true,
        // Con este atributo se Castean todos los campos del tipo BIT a BOOLEAN
        typeCast: function castField(field, useDefaultTypeCasting ) {

            // We only want to cast bit fields that have a single-bit in them. If the field
            // has more than one bit, then we cannot assume it is supposed to be a Boolean.
            if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                var bytes = field.buffer();

                // A Buffer in Node represents a collection of 8-bit unsigned integers.
                // Therefore, our single "bit field" comes back as the bits '0000 0001',
                // which is equivalent to the number 1.
                return( bytes[ 0 ] === 1 );
            }

            return( useDefaultTypeCasting() );
        }
    });
// } else {
//     console.log("No hay Conexión");
// }*/

connection.connect(function(err) {
    if (err) {
        console.log('<Connection Error>');
        console.log(err);
        console.log('</Connection Error>');

        throw err;
    } else {
        console.log('Connected');
    }
});

module.exports = connection;
