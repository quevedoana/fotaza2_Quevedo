# Fotaza 2

Proyecto desarrollado para la materia **Programación Web II**.

Fotaza 2 es una aplicación web orientada a compartir fotografías, permitiendo a los usuarios publicar imágenes, comentar, valorar publicaciones y seguir a otros usuarios.

---

## Tecnologías utilizadas

* Node.js
* Express
* PostgreSQL
* Sequelize ORM
* Pug
* Tailwind CSS
* Express Session
* Bcrypt

---

## Funcionalidades implementadas

### Usuarios

* Registro de usuarios.
* Inicio y cierre de sesión.
* Perfil de usuario.
* Edición de perfil.

### Publicaciones

* Creación de publicaciones.
* Carga de múltiples imágenes.
* Edición de publicaciones.
* Eliminación de publicaciones.
* Visualización de publicaciones.

### Interacción

* Comentarios sobre fotografías.
* Valoración de fotografías.
* Cálculo de promedio de valoraciones.

### Social

* Seguimiento de usuarios.
* Visualización de seguidores y seguidos.

### Búsqueda

* Búsqueda de publicaciones.
* Búsqueda de usuarios.
* Búsqueda por etiquetas.

---

## Requisitos

* Node.js 18 o superior.
* PostgreSQL.
* npm.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd fotaza2_Quevedo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` utilizando como referencia el archivo `.env.example`.

Ejemplo:

```env
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_PORT=5432

SESSION_KEY=

NODE_ENV=development
```

### 4. Inicializar la base de datos

```bash
npm run db:init
```

Este comando crea los registros de ejemplo necesarios para probar la aplicación.

### 5. Iniciar la aplicación

```bash
npm start
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

## Usuarios de prueba

Contraseña para todos los usuarios:

```text
123456
```

### Usuario 1

```text
Email: ana@test.com
Usuario: ana
```

### Usuario 2

```text
Email: juan@test.com
Usuario: juan
```

### Usuario 3

```text
Email: maria@test.com
Usuario: maria
```

---

## Base de datos

El proyecto incluye:

* Script de inicialización mediante `npm run db:init`.
* Archivo de respaldo SQL de la base de datos.
* Configuración mediante variables de entorno.

---

## Despliegue

La aplicación se encuentra desplegada en un servidor público utilizando:

* Render (Aplicación)
* Neon (Base de Datos PostgreSQL)

---

## Integrantes

* Ana Paula Quevedo

---

## Observaciones

Las imágenes son almacenadas en la base de datos PostgreSQL mediante campos BLOB.

La interfaz fue desarrollada utilizando Pug como motor de plantillas y Tailwind CSS para el diseño visual.
