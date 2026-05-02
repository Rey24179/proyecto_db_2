# Proyecto 2 - Gestión de Inventario y Ventas

## Descripción
Este proyecto consiste en una aplicación web para la gestión de inventario y ventas, desarrollada con **PostgreSQL**, **Node.js + Express**, **HTML/CSS/JavaScript** y **Docker**.

La aplicación permite administrar clientes y productos, visualizar reportes, ejecutar consultas SQL desde la interfaz y registrar órdenes mediante una transacción con manejo de errores y `ROLLBACK`.

## Tecnologías utilizadas
- PostgreSQL 16
- Node.js
- Express
- HTML, CSS y JavaScript
- Docker
- Docker Compose

## Estructura del proyecto

```text
proyecto/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── db.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── Dockerfile
├── db/
│   └── init.sql
├── .env
├── .env.example
└── docker-compose.yml
