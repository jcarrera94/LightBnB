SELECT properties.id as id, properties.title as title, properties.cost_per_night as cost_per_night, reservations.start_date as start_date, avg(property_reviews.rating) as average_rating
FROM reservations
JOIN properties ON properties.id = reservations.property_id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
GROUP BY properties.id, properties.title, properties.cost_per_night, reservations.start_date, reservations.end_date
HAVING reservations.end_date < now()::date
ORDER BY reservations.start_date
LIMIT 10;