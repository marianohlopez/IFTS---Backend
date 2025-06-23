# Proyecto de Backend: "Huellitas Felices" - Gestión de Veterinaria

Este proyecto es una aplicación web de backend desarrollada como parte de la materia "Desarrollo Web Backend" del IFTS N°29. La aplicación simula un sistema de gestión para una clínica veterinaria, incluyendo manejo de productos, mascotas, turnos y reportes de mascotas perdidas/encontradas.

---

## Despliegue en Línea (Deployment)

La aplicación está desplegada y accesible en la siguiente URL:

**[https://ifts-backend.onrender.com/](https://ifts-backend.onrender.com/)**

#### Credenciales de Prueba:
- **Usuario:** `admin`
- **Contraseña:** `password`

---

## Funcionalidades Principales

El sistema cuenta con los siguientes módulos y funcionalidades:

*   **Autenticación de Usuarios:**
    *   Registro de nuevos usuarios (administradores, etc.).
    *   Login de usuarios con credenciales.
    *   Sistema de sesiones para mantener al usuario autenticado.
    *   Protección de rutas para asegurar que solo usuarios logueados puedan acceder a ciertas funcionalidades.

*   **Gestión de Productos (Inventario):**
    *   Listado de productos de la veterinaria.
    *   Creación, actualización y eliminación de productos.
    *   Persistencia de datos en MongoDB.

*   **Gestión de Mascotas (Pacientes):**
    *   Registro de las mascotas de los clientes con su información relevante (nombre, especie, raza, notas clínicas, etc.).
    *   Funcionalidad para la gestión de las fichas de las mascotas.

*   **Gestión de Turnos:**
    *   Sistema para agendar nuevos turnos, asociando una mascota, fecha, hora y tipo de servicio.
    *   Lógica para verificar la disponibilidad de horarios.
    *   Listado, actualización y cancelación de turnos.

*   **Gestión de Mascotas Perdidas/Encontradas:**
    *   Funcionalidad para que los usuarios registrados puedan crear reportes de mascotas perdidas o encontradas.
    *   Cada reporte está asociado al usuario que lo creó.
    *   Listado de todos los reportes de mascotas perdidas (perdida/encontrada).
    *   CRUD completo, permitiendo a los usuarios editar y eliminar sus propios reportes.

---

## Tecnologías y Arquitectura

*   **Backend:** Node.js con Express.js para el servidor y el enrutamiento.
*   **Base de Datos:** MongoDB Atlas, con Mongoose como ODM (Object Data Modeling) para interactuar con la base de datos de forma estructurada.
*   **Motor de Plantillas:** Pug para generar las vistas HTML del lado del servidor.
*   **Autenticación:** Passport.js con la estrategia `passport-local` para la autenticación de usuario y contraseña, y `express-session` para el manejo de sesiones basadas en cookies.
*   **Seguridad:** `bcrypt` para el hashing seguro de las contraseñas de los usuarios.
*   **Middleware:** `method-override` para permitir el uso de métodos HTTP como PUT y DELETE desde formularios HTML.

---

## Instalación y Ejecución en Local

Para correr este proyecto en tu entorno de desarrollo local, sigue estos pasos:

### 1. Prerrequisitos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada).
- Tener una cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para crear una base de datos.
- Tener instalado [Git](https://git-scm.com/).

### 2. Clonar el Repositorio
```bash
git clone https://github.com/marianohlopez/IFTS---Backend.git
cd IFTS---Backend
```

### 3. Instalar Dependencias
Ejecuta el siguiente comando en la raíz del proyecto para instalar todos los paquetes necesarios.
```bash
npm install
```

### 4. Configurar Variables de Entorno
Crea un archivo llamado `.env` en la raíz del proyecto. Puedes copiar el contenido de `.env.example` y rellenarlo.

```env
# Archivo .env
MONGO_URL="tu_string_de_conexion_de_mongodb_atlas"
```
Reemplaza `"tu_string_de_conexion_de_mongodb_atlas"` con la URI de conexión que te proporciona MongoDB Atlas.

### 5. Ejecutar la Aplicación
Usa el siguiente comando para iniciar el servidor en modo de desarrollo (con `nodemon` para reinicios automáticos).
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## Bibliografía y Fuentes

Para el desarrollo de este proyecto se consultaron las siguientes documentaciones oficiales y recursos, que sirvieron como guía para la implementación de las diversas funcionalidades:

*   **Documentación Oficial de Node.js:** Para consultas generales sobre el entorno de ejecución.
    *   [https://nodejs.org/en/docs](https://nodejs.org/en/docs)

*   **Documentación Oficial de Express.js:** Guía principal para el enrutamiento, middlewares y la estructura general de la aplicación.
    *   [https://expressjs.com/](https://expressjs.com/)

*   **Documentación Oficial de Mongoose:** Referencia esencial para la conexión a MongoDB, la definición de Schemas y Modelos, y la ejecución de consultas a la base de datos.
    *   [https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)

*   **Documentación Oficial de Passport.js:** Utilizada para entender e implementar las estrategias de autenticación, especialmente `passport-local` y el manejo de sesiones.
    *   [http://www.passportjs.org/docs/](http://www.passportjs.org/docs/)

*   **Documentación de Pug (Jade):** Para la sintaxis y funcionalidades del motor de plantillas.
    *   [https://pugjs.org/api/getting-started.html](https://pugjs.org/api/getting-started.html)

*   **Asistencia de Inteligencia Artificial:** Se utilizó un asistente de IA como tutor y guía pedagógica para la resolución de dudas específicas, depuración de código, comprensión de conceptos y estructuración del proyecto.

---

## Roles y Responsabilidades del Equipo

*   **Mariano López:** Implementación inicial del servidor, módulo de Productos, implementación a Mongoose y guía para resolución de dudas.
*   **Ernesto Pisano:** Implementación del módulo de Mascotas/Turnos.
*   **Facundo Villarreal:** Implementación del módulo completo de Mascotas Perdidas/Encontradas.