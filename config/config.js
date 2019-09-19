require('dotenv').config(); // this is important!
module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "localhost",
    dialect: "postgres",
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 5000
    }
  },
  test: {
    username: "root",
    password: null,
    database: "spintly_lighting_test",
    host: "127.0.0.1",
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