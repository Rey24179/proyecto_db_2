# Proyecto 3 – Sistema de Inventario y Ventas con Seguridad

Aplicación web para la gestión de inventario, clientes, órdenes y reportes, desarrollada con arquitectura por capas, base de datos relacional (**PostgreSQL**) y contenedores **Docker**.

---

## Ejecución del proyecto

### Aspectos importantes del proyecto
Este proyecto parte de la base funcional del **Proyecto 2** y la extiende con autenticación, control de acceso por rol, protección de rutas y vistas, ORM y procedimientos almacenados.

La aplicación incluye:
- gestión de clientes
- gestión de productos
- registro de órdenes
- reportes por cliente
- consultas SQL visibles desde la interfaz
- inicio y cierre de sesión según rol

La base de datos utilizada es **PostgreSQL**, que es el gestor de base de datos del proyecto.

---

## Requisitos

- Docker
- Docker Compose

---

## Pasos para ejecutar

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd proyecto