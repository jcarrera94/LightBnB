SELECT properties.id as id, properties.title as title, properties.cost_per_night as cost_per_night, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE city LIKE '%Vancouver%'
GROUP BY properties.id, properties.title, properties.cost_per_night
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;