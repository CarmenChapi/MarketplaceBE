const format = require("pg-format");
const db = require("../connection");

const seed = ({ categoriesData, usersData, articlesData, basketItemsData, ordersData, ordersItemsData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS basket_items, articles, orders, orders_items, categories, users CASCADE;`
    )
    .then(() => {
      const categoriesTablePromise = db.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL
      );`);

      const usersTablePromise = db.query(`
     CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      kudos INT DEFAULT 0 NOT NULL,
      image_url VARCHAR DEFAULT 'https://media.istockphoto.com/id/2166255703/photo/3d-rendering-of-user-profile-icon.webp?a=1&b=1&s=612x612&w=0&k=20&c=NZiPdBBEjiYq8ZNX-ecoNKXAkpl1MBMb7xn8Stc0y7Q=',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
        
      return Promise.all([categoriesTablePromise, usersTablePromise]);
    })
    .then(() => {
    
      return db.query(`
      CREATE TABLE articles (
         id SERIAL PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         description TEXT,
         price DECIMAL(10,2) NOT NULL,
         image_url TEXT,
         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
         category_id INTEGER REFERENCES categories(id),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
     
      return db.query(`
      CREATE TABLE basket_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      total DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE orders_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      article_id INTEGER REFERENCES articles(id),
      quantity INTEGER DEFAULT 1,
      price DECIMAL(10,2)
      );`);
    })
    .then(() => {
      const insertCategoriesQueryStr = format(
        "INSERT INTO categories (name) VALUES %L;",
        categoriesData.map(({name}) => [name])
      );
      const categoriesPromise = db.query(insertCategoriesQueryStr);

      const insertUsersQueryStr = format(
        "INSERT INTO users ( email, name, password_hash, image_url) VALUES %L;",
        usersData.map(({ email, name, password_hash, image_url }) => [
          email,
          name,
          password_hash,
          image_url,
        ])
      );
    
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([categoriesPromise, usersPromise]);
    })
    .then(() => {
      const insertArticlesQueryStr = format(
        "INSERT INTO articles (title, description, price, image_url, user_id, category_id) VALUES %L RETURNING *;",
        articlesData.map(
          ({
            title,
            description,
            price,
            image_url,
            user_id,
            category_id,
          }) => [title, description, price, image_url, user_id, category_id]
        )
      );
 
      return db.query(insertArticlesQueryStr);
    })
    .then(() => {

      const insertBasketQueryStr = format(
        "INSERT INTO basket_items (user_id, article_id, quantity) VALUES %L RETURNING *;",
        basketItemsData.map(
          ({ user_id, article_id, quantity
           }) => [
            user_id,
            article_id,
            quantity
          ]
        )
      );
   
      return db.query(insertBasketQueryStr);
    })
    .then(() => {

      const insertOrdersQueryStr = format(
        "INSERT INTO orders (user_id, total) VALUES %L;",
        ordersData.map(
          ({ user_id, total
           }) => [
            user_id,
            total,
          ]
        )
      );
   
      return db.query(insertOrdersQueryStr);
    })
    .then(() => {
     
      const insertOrdersItemsQueryStr = format(
        "INSERT INTO orders_items (order_id, article_id, quantity, price) VALUES %L;",
        ordersItemsData.map(
          ({ order_id, article_id, quantity, price
           }) => [
            order_id,
            article_id,
            quantity,
            price
          ]
        )
      );
      return db.query(insertOrdersItemsQueryStr);
    });
};

module.exports = seed;
