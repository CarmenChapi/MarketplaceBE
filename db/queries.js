exports.querySelectUsers = 
`SELECT *
FROM users ;`

exports.querySelectUserById =
`SELECT *
FROM users
WHERE id = $1 ;`

exports.queryInsertUser =
`INSERT INTO users
  (email, name, password_hash, image_url)
   VALUES ($1, $2, $3, $4) 
   RETURNING *;`