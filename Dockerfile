# Usar una imagen base de Node.js ligera y segura
FROM node:18-alpine

# Instalar node-fetch si es necesario (para versiones de Node < 18)
# RUN npm install -g node-fetch@2 

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el resto del código de la aplicación al directorio de trabajo
COPY ./src .

# Instalar las dependencias de la aplicación (incluyendo pm2)
RUN npm install --production

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación usando pm2-runtime
# pm2-runtime es la forma correcta de usar PM2 en contenedores
CMD ["npm", "run", "start"]