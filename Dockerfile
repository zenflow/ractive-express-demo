FROM node:14-slim
WORKDIR /app
ADD package.json .
RUN npm install
ADD app.js .
ADD public ./public
ADD views ./views
CMD node app.js
