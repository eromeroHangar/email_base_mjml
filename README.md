# Proyecto de Emails con MJML

Este proyecto utiliza el framework MJML para crear emails responsivos y con un diseño profesional. MJML simplifica la creación de emails complejos al proporcionar una sintaxis sencilla y componentes reutilizables.

## ¿Qué es MJML?

MJML es un lenguaje de marcado que se transpila a HTML responsivo. Permite crear emails que se ven bien en diferentes clientes de correo electrónico y dispositivos, evitando la necesidad de escribir código HTML y CSS complejo y específico para cada cliente.

## Cómo usar este proyecto

1. **Requisitos:**

   - Asegúrate de tener Node.js y npm instalados.
   - Se recomienda usar nvm (Node Version Manager) para gestionar las versiones de Node.js.

2. **Instalación:**

   - Abre la terminal en la carpeta del proyecto.
   - Ejecuta `nvm use` para usar la versión de Node.js especificada en el archivo `.nvmrc` (si existe).
   - Ejecuta `npm install` para instalar las dependencias del proyecto.

3. **Desarrollo:**

   - Ejecuta `npm start` para iniciar el servidor de desarrollo. Esto te permitirá ver los emails en tiempo real mientras los editas.

4. **Construcción:**
   - Ejecuta `npm run build` para generar los archivos HTML finales de los emails. Estos archivos estarán listos para ser enviados.

## Estructura del proyecto

- `src`: Contiene los archivos MJML de los emails.
- `build`: Contiene los archivos HTML generados.
- `package.json`: Archivo de configuración de npm con las dependencias y scripts.
- `.nvmrc`: (Opcional) Archivo que especifica la versión de Node.js a usar con nvm.

## Personalización

- Edita los archivos `.mjml` en la carpeta `src` para modificar el contenido y diseño de los emails.
- Puedes agregar nuevos archivos `.mjml` para crear emails adicionales.

## Recursos

- [Documentación de MJML](https://mjml.io/documentation/)
- [Sitio web de MJML](https://mjml.io/)

¡Esperamos que este proyecto te sea útil para crear emails increíbles!
