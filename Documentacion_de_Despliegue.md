# Documentación de Despliegue

## Tienda Sol

# 

# 

# Índice

## 	[Introducción](#introducción)

## 	[Arquitectura de Despliegue](#arquitectura-de-despliegue)

## 	[Prerrequisitos](#prerrequisitos)

## [Configuración de Base de Datos (MongoDB Atlas)](#configuración-de-base-de-datos-\(mongodb-atlas\))

## 	[Despliegue del Backend (Render)](#despliegue-del-backend-\(render\))

## 	[Despliegue del Frontend (Netlify)](#despliegue-del-frontend-\(netlify\))

## 	[Proceso de Nueva Release](#proceso-de-nueva-release)

## 	[Documentación Oficial](#documentación-oficial)

# 

# Introducción {#introducción}

Este documento detalla el proceso completo para desplegar Tienda Sol en producción. La aplicación está estructurada como un monorepo con:

* Backend: API REST en Node.js con Express (carpeta **/backend**)  
* Frontend: Aplicación React con Create React App (carpeta **/client**)  
* Base de Datos: MongoDB Atlas

# Arquitectura de Despliegue {#arquitectura-de-despliegue}

## 	URLs Actuales:

* Backend: [https://tienda-sol-backend-fdi4.onrender.com](https://tienda-sol-backend-fdi4.onrender.com)  
* Frontend: [https://sol-tienda.netlify.app](https://sol-tienda.netlify.app) 

# Prerrequisitos {#prerrequisitos}

## 	Cuentas Requeridas

* Cuenta de [GitHub](https://github.com) con el repositorio del proyecto  
* Cuenta de [Render](https://render.com)  
* Cuenta de [Netlify](https://netlify.com)  
* Cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 	Software Local

* Node.js v18 o superior  
* npm (incluido con Node.js)  
* Git configurado

# Configuración de Base de Datos (MongoDB Atlas) {#configuración-de-base-de-datos-(mongodb-atlas)}

## 	Paso 1: Crear Cluster

1. Iniciar sesión en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
2. Crear un proyecto  
3. Ir a “DATABASE: Clusters"  
4. Seleccionar la opción “Create”  
5. Crear Cluster  
   1. Plan: FREE  
   2. Provider: AWS  
   3. Region: usar la recomendada

## 	Paso 2: Configurar Acceso de Red

1. Ir a "SECURITY: Database & Network Access”  
2. Ir a “NETWORK ACCESS: IP Access List”  
3. Seleccionar la opción “ADD IP ADDRESS”  
4. Crear IP   
   1. Access List Entry: **0.0.0.0/0**

## 	Paso 3: Crear Usuario de Base de Datos

1. Ir a "SECURITY: Database & Network Access”  
2. Ir a “DATABASE ACCESS: Database Users”  
3. Seleccionar la opción “ADD NEW DATABASE USER”  
4. Crear User  
   1. Authentication Method: Password  
   2. Password Authentication: genera una contraseña y guardala  
   3. Database User Privileges: Read and write to any database

## 	Paso 4: Obtener Cadena de Conexión {#paso-4:-obtener-cadena-de-conexión}

1. Ir a “DATABASE: Clusters"  
2. Seleccionar la opción “Connect” en el Cluster creado previamente  
3. Conectar Cluster  
   1. Seleccionar la opción “Drivers”  
   2. Driver: Node.js  
   3. Version: 6.7 or later  
   4. Copiar la cadena de conexión que aparece. Ej: mongodb+srv://\<nombre\_del\_usuario\>:**\<db\_password\>**@\<nombre-del-cluster\>.xxxx.mongodb.net/**?**appName=\<nombre\_del\_cluster\>  
   5. Reemplazar **\<db\_password\>** por la contraseña del usuario creado previamente  
   6. Agregar nombre de la base de datos antes de **?**  
4. Guardar la cadena de forma segura. Será utilizara en Render

# Despliegue del Backend (Render) {#despliegue-del-backend-(render)}

## 	Paso 1: Crear Web Service

1. Iniciar sesión en [Render Dashboard](https://dashboard.render.com)  
2. Crear un proyecto  
3. Seleccionar la opción “Add Environment”  
4. Seleccionar la opción “Create new service” \+ “New Web Service”  
5. Conectar repositorio de GitHub  
   1. Si es la primera vez, autorizar a Render  
   2. Seleccionar repositorio

## 	Paso 2: Configurar el Servicio {#paso-2:-configurar-el-servicio}

Completar los siguientes campos:

| Campo | Valor |
| :---- | :---- |
| Name \* | tienda-sol-backend |
| Region | Oregon (US West) o la más cercana |
| Branch \*  | main |
| Root Directory | backend |
| Build Command | npm install |
| Start Command | npm start |
| Instance Type | Free |

En los campos identificados con un \*, el valor indicado es el recomendado

## 	Paso 3: Configurar Variables de Entorno

Agregar las siguientes variables en “Add Environment Variable”:

| Key | Value |
| :---- | :---- |
| NODE\_ENV | production |
| PORT | 3001 |
| MONGODB\_URI | [(Cadena de conexión completa)](#paso-4:-obtener-cadena-de-conexión) |
| MONGODB\_DB\_NAME | (Nombre de la base de datos) |
| FRONTEND\_URL | [(Aguardar a paso 6 del Frontend)](#paso-6:-actualizar-cors-en-backend) |
| JWT\_SECRET | (Generar un secreto seguro) |

## 	Paso 4: Crear el Servicio

1. Revisar que toda la configuración sea correcta  
2. Seleccionar la opción “Deploy Web Service”  
3. Aguardar el despliegue de Render

## 	Paso 5: Verificar el Despliegue {#paso-5:-verificar-el-despliegue}

Una vez que el estado sea **Live**

1. Copiar la URL asignada por Render  
2. Verificar el health check  
   1. \<URL\>/health-check

# Despliegue del Frontend (Netlify) {#despliegue-del-frontend-(netlify)}

## 	Paso 1: Configurar Variable de Entorno

Verificar archivo **.env.production** en **/client**. Actualizar URL por la del nuevo servicio en Render

## 	Paso 2: Crear Sitio en Netlify

1. Iniciar sesión en [Netlify](https://netlify.com)  
2. Seleccionar la opción “Add new project” → “Import an existing project”  
3. Seleccionar la opción “Deploy with GitHub”  
   1. Si es la primera vez, autorizar a Netifly  
   2. Seleccionar repositorio

## 	Paso 3: Configurar Build Settings

Completar los siguientes campos:

| Campo | Valor |
| :---- | :---- |
| Project name | (Nombre que deseas para la URL) |
| Branch to deploy \* | main |
| Base directory | client |
| Build command | npm run build |
| Publish directory | client/build |

En los campos identificados con un \*, el valor indicado es el recomendado

## 	Paso 4: Agregar Variables de Entorno

1. Seleccionar la opción “Add environment variables” → “Add key/value pairs”  
2. Agregar:

| Key | Value |
| :---- | :---- |
| REACT\_APP\_API\_URL | [(URL del backend)](#paso-5:-verificar-el-despliegue) |

## 	Paso 5: Deploy

1. Seleccionar la opción “Deploy”  
2. Aguardar el despliegue de Netlify  
3. Copiar URL asignada por Netlify

## 	Paso 6: Actualizar CORS en Backend {#paso-6:-actualizar-cors-en-backend}

1. Ir a [Render Dashboard](https://dashboard.render.com)  
2. Ir a “Environment”  
3. Ir a “Environment Variables”  
4. Actualizar el Value de FRONTEND\_URL con la URL asignada por Netlify  
5. Guardar cambio

# Proceso de Nueva Release {#proceso-de-nueva-release}

## 	Pasos para Nueva Funcionalidad

1. Crear Rama Feature

*\# Asegúrate de estar en main y actualizado*   
git checkout main  
git pull origin main   
*\# Crea nueva rama*   
git checkout \-b feature/nombre-descriptivo

2. Desarrollar y Commitear

*\# Hacer cambios en el código*   
*\# ...*   
*\# Agregar cambios*   
git add .   
*\# Commit con mensaje descriptivo*   
git commit \-m "feat: descripción clara de la funcionalidad"

3. Push a GitHub

git push origin feature/nombre-descriptivo

4. Crear Pull Request  
5. Revisar y Merge  
6. Actualizar Main Local

## 	Despliegue Automático

Una vez que los cambios están en la rama seleccionada en [Backend](#paso-2:-configurar-el-servicio) y [Frontend](#paso-2:-configurar-el-servicio)  
**Backend (Render)**

1. Render detecta el push automáticamente  
2. Inicia build: npm install  
3. Ejecuta: npm start  
4. Realiza health checks  
5. Si todo OK, reemplaza la versión anterior

   

	Monitorear el despliegue:

* Ir a [Render Dashboard](https://dashboard.render.com)  
* Seleccionar tu servicio  
* Ir a “Events” para ver el progreso  
* Ir a “Logs” para revisar en tiempo real

**Frontend (Netlify)**

1. Netlify detecta el push automáticamente  
2. Inicia build: npm run build  
3. Publica en CDN  
4. Invalida caché anterior

	Monitorear el despliegue:

* Ir a [Netlify](https://netlify.com)  
* Seleccionar tu sitio  
* Ir a “Deploys”  
* Visualizar estado en tiempo real

# Documentación Oficial {#documentación-oficial}

* [Documentación de Render](https://render.com/docs)  
* [Documentación de Netlify](https://docs.netlify.com/)  
* [Documentación de MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

