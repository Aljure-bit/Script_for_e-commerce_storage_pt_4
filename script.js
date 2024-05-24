const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path'); // Importamos el módulo path para manejar rutas de archivos
const os = require('os'); // Importamos el módulo os para obtener información del sistema operativo

async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        // Conexión a la base de datos
        await client.connect();
        console.log("Conexión a la base de datos realizada");

        // Seleccionamos nuestra base de datos y creamos la colección que se llamará productos
        const database = client.db('db_prueba');
        const productos = database.collection('productos');

        // Insertamos 3 documentos a la colección creada anteriormente
        const documentos = [
            { id: 1, nombre: 'Atún Lomo Agua', precio: 4920, cantidad: 15 },
            { id: 2, nombre: 'Blanqueador sin fragancia', precio: 2780, cantidad: 20 },
            { id: 3, nombre: 'Aceite vegetal', precio: 6440, cantidad: 18 }
        ];

        await productos.insertMany(documentos);
        console.log("Documentos insertados");

        // Ruta del directorio donde queremos guardar el archivo JSON
        const userHomeDir = os.homedir(); // Obtiene el directorio home del usuario
        const outputDir = path.join(userHomeDir, 'miAppIonic'); // Ajustamos la carpeta según nuestra preferencia
        if (!fs.existsSync(outputDir)) {
            console.error(`El directorio ${outputDir} no existe.`);
            return;
        }

        // Guarda los documentos en un archivo JSON en el directorio especificado
        const jsonData = JSON.stringify({ productos: documentos }, null, 2); 
        const outputFile = path.join(outputDir, 'data/productos.json');
        fs.writeFileSync(outputFile, jsonData, (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log(`JSON file has been saved to ${outputFile}`);
            }
        });

        // Implementamos una función que recibe el nombre de un producto y devuelve su precio
        async function obtenerPrecio(nombreProducto) {
            const producto = await productos.findOne({ nombre: nombreProducto });
            if (producto) {
                return producto.precio;
            } else {
                return null;
            }
        }

        // Aquí usamos nuestra función
        let nomProducto = 'Aceite vegetal';
        const precio = await obtenerPrecio(nomProducto);
        console.log(`El precio del ${nomProducto} es de: ${precio}`);

    } finally {
        await client.close();
    }
}

main().catch(console.error);




