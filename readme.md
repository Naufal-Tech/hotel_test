# Project Setup

## Using Sequelize Commands

To set up and manage your project using Sequelize, follow these commands:

### Installing Dependencies

Command: sequelize

1. npm i --save sequelize
2. npm i --save pg pg-hstore
3. npm i --save sequelize-cli
4. npx sequelize-cli init
5. sequelize model:generate --name sales --attributes name:String,email:String,sales_commission:Numeric,owner_commission:Numeric
6. sequelize db:migrate --name your-migration-file-name.js
7. npx sequelize-cli db:create / sequelize db:create
8. npx sequelize-cli db:migrate / sequelize db:migrate
9. npx sequelize-cli db:migrate:undo
10. npx sequelize-cli seed:generate --name user
11. npx sequelize-cli db:seed --seed ./seeders/namefile.js || sequelize db:seed --seed ./seeders/namefile.js

// Do not forget after seeding the hotel, please adjust the id of hotels to kamar_hotel seeder

FOLLOW THESE STEPS:

1. cd api
2. Do not forget to change the configuration database (password, etc)
3. sequelize db:create
4. sequelize db:migrate
5. Running Seed one by one: npx sequelize-cli db:seed --seed ./seeders/namefile.js
6. On Seeding: kamar_hotel, just make user and adjusted hotel_id with existing hotel id in database
7. cd ..
8. npm start

## LINK POSTMAN: https://documenter.getpostman.com/view/20393150/2s9YBz4bG1

# Seeder Flow: cd api

1. Seeder User: sequelize db:seed --seed ./seeders/user.js
2. Seeder User: sequelize db:seed --seed ./seeders/hotel.js
3. Seeder User: sequelize db:seed --seed ./seeders/sales.js
4. Seeder User: sequelize db:seed --seed ./seeders/kamar_hotel.js
