const format = require("pg-format");
const db = require("../connection");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS basket_items, articles, orders, orders_
        items, categories, users CASCADE;`
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
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE basket_items (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`);
    })
    .then(() => {
      const insertTopicsQueryStr = format(
        "INSERT INTO topics (slug, description) VALUES %L;",
        topicData.map(({ slug, description }) => [slug, description])
      );
      const topicsPromise = db.query(insertTopicsQueryStr);

      const insertUsersQueryStr = format(
        "INSERT INTO users ( username, name, avatar_url) VALUES %L;",
        userData.map(({ username, name, avatar_url }) => [
          username,
          name,
          avatar_url,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([topicsPromise, usersPromise]);
    })
    .then(() => {
      const formattedArticleData = articleData.map(convertTimestampToDate);
      const insertArticlesQueryStr = format(
        "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
        formattedArticleData.map(
          ({
            title,
            topic,
            author,
            body,
            created_at,
            votes = 0,
            article_img_url,
          }) => [title, topic, author, body, created_at, votes, article_img_url]
        )
      );

      return db.query(insertArticlesQueryStr);
    })
    .then(({ rows: articleRows }) => {
      const articleIdLookup = createRef(articleRows, "title", "article_id");
      const formattedCommentData = formatComments(commentData, articleIdLookup);

      const insertCommentsQueryStr = format(
        "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;",
        formattedCommentData.map(
          ({ body, author, article_id, votes = 0, created_at }) => [
            body,
            author,
            article_id,
            votes,
            created_at,
          ]
        )
      );
      return db.query(insertCommentsQueryStr);
    });
};

module.exports = seed;
