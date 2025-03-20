FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps \
    @nestjs/typeorm@10.0.0 \
    @nestjs/config@3.0.0 \
    class-validator@0.14.0 \
    typeorm@0.3.17 \
    pg@8.11.3
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]