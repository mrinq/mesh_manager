require('dotenv').config(); // this is important!
module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 5000
    }
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "home-lighting-db.coyvxgfrewsk.ap-south-1.rds.amazonaws.com",
    dialect: "postgres",
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 5000
    }
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "home-lighting-db.coyvxgfrewsk.ap-south-1.rds.amazonaws.com",
    dialect: "postgres",
    pool: {
      max: 2,
      min: 1,
      acquire: 30000,
      idle: 5000
    }
  }
}