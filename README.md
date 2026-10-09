# Recolector de Fotos y Firma

Aplicación para capturar **dos fotos** y una **firma digital** desde una app móvil hecha con Expo, y enviar todo a un backend en Node.js/Express que guarda los registros en MySQL y los expone en una vista web.

## Características

- Captura de 2 fotografías desde cámara.
- Captura de firma digital sobre lienzo.
- Envío de imágenes en base64 al backend.
- Guardado de archivos en la carpeta `uploads/`.
- Autenticación con JWT para la vista de registros.
- Panel web para iniciar sesión y consultar registros.

## Estructura del proyecto

- `backend/` — API en Express, autenticación, almacenamiento y vistas web.
- `recolector-fotos-firma/` — App móvil con Expo para captura de fotos y firma.

## Requisitos

- Node.js 18 o superior.
- npm.
- MySQL.
- Expo Go o emulador/dispositivo para la app móvil.

## Configuración del backend

1. Entra a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` con variables como estas:

   ```env
   PORT=4000
   JWT_SECRET=tu_clave_secreta

   DB_SERVER=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=tu_base_de_datos
   DB_PORT=3306
   ```

4. Asegúrate de tener las tablas necesarias en MySQL:

   - `Usuarios`
   - `Registros`

5. Inicia el servidor:

   ```bash
   npm start
   ```

El backend quedará disponible en `http://localhost:4000` por defecto.

## Configuración de la app móvil

1. Entra a la carpeta de la app:

   ```bash
   cd recolector-fotos-firma
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Revisa la URL del backend en `App.js` y ajusta la IP si es necesario:

   - `API_BASE = 'http://TU_IP:4000'`

4. Inicia Expo:

   ```bash
   npm start
   ```

## Uso

### App móvil

1. Abre la app en Expo.
2. Concede permisos de cámara.
3. Toma la primera foto.
4. Toma la segunda foto.
5. Firma en el lienzo digital.
6. Pulsa **Subir Datos** para enviar el registro.

### Panel web

- Abre `http://localhost:4000/` para ver el login.
- Después de autenticarse, se redirige a `/registros`.
- La vista de registros muestra fotos y firma de cada captura.

## Endpoints principales

### Autenticación

- `POST /api/auth/register` — registra un usuario.
- `POST /api/auth/login` — inicia sesión y crea la cookie JWT.
- `GET /api/auth/profile` — obtiene el perfil del usuario autenticado.
- `POST /api/auth/logout` — cierra sesión.

### Registros

- `POST /api/registros` — crea un nuevo registro con Foto1, Foto2 y Firma.
- `GET /api/registros` — obtiene todos los registros.

### Usuarios

- `GET /api/users` — lista usuarios de la base de datos.

## Notas importantes

- Las imágenes enviadas desde la app se guardan como archivos dentro de `backend/uploads/`.
- La vista `/registros` requiere una cookie JWT válida.
- En la app móvil, la URL del backend debe apuntar a la IP real de tu máquina si pruebas desde un teléfono físico.

## Tecnologías usadas

- **Backend:** Node.js, Express, MySQL, JWT, Multer, CORS.
- **Frontend móvil:** Expo, React Native, Expo Camera, React Native Signature Canvas.
