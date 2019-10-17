const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `
  SELECT users.* FROM users
  WHERE users.email = $1;
  `;
  const values = [`${email || null}`];

  return pool.query(queryString, values)
  .then(res => res.rows[0])
  .catch(err => console.error('query error: ', err.stack));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const queryString = `
  SELECT * FROM users
  WHERE id = $1`;
  const values = [`${id || null}`];
  return pool.query(queryString, values)
  .then(res => res.rows[0])
  .catch(err => console.error('query error: ', err.stack));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  const values = [`${user.name}`, `${user.email}`, `${user.password}`];
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`

  return pool.query(queryString, values)
  .then(res => res.rows[0])
  .catch(err => console.error('query error: ', err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.start_date as start_date, avg(property_reviews.rating) as average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, properties.title, properties.cost_per_night, reservations.start_date, reservations.end_date
  HAVING reservations.end_date < now()::date
  ORDER BY reservations.start_date
  LIMIT $2;`
  const values = [`${guest_id}`, `${limit}`];
  return pool.query(queryString, values)
  .then(res => res.rows)
  .catch(err => console.error('query error: ', err.stack));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  const values = [];
  let queryString = `
  SELECT properties.*, avg(rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id`;

  filter = false;

  if (options.city) {
    values.push(`%${options.city}%`);
    queryString += ` WHERE city iLIKE $${values.length}`;
    filter = true;
  }

  if (options.owner_id) {
    values.push(options.owner_id);
    queryString += `${filter ? ' AND' : ' WHERE'} owner_id = $${values.length}`;
    filter = true;
  }

  if (options.minimum_price_per_night) {
    values.push(options.minimum_price_per_night * 100);
    queryString += `${filter ? ' AND' : ' WHERE'} cost_per_night >= $${values.length}`;
    filter = true;
  }

  if (options.maximum_price_per_night) {
    values.push(options.maximum_price_per_night * 100);
    queryString += `${filter ? ' AND' : ' WHERE'} cost_per_night <= $${values.length}`;
    filter = true;
  }

  queryString += ` GROUP BY properties.id`

  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    queryString += ` HAVING avg(property_reviews.rating) >= $${values.length}`;
  }

  values.push(limit);
  queryString += ` ORDER BY cost_per_night
  LIMIT $${values.length};
  `;

  return pool.query(queryString, values)
  .then(res => res.rows)
  .catch(err => console.error('query error: ', err.stack));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
