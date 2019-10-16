INSERT INTO users (name, email, password) 
VALUES ('Juan', 'juan@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Junon', 'junon@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jen', 'jen@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, country, street, city, province, post_code)
VALUES (1, 'cool house', 'description', 'thumbnai.url.com', 'coverphoto.url.com', 'canada', '935 KingRica Dr', 'Toronto', 'Ontario', 'L3T 3H5'),
(1, 'Mansion', 'description', 'thumbnai1.url.com', 'coverphoto1.url.com', 'canada', '935 Rica Rd', 'Toronto', 'Ontario', 'L3T 6L8'),
(2, 'Cotty', 'description', 'thumbna2.url.com', 'covero.url.com', 'canada', '92 Lochica Dr', 'Toronto', 'Ontario', 'L3T 1H5');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2019-10-20', '2019-11-01', 1, 2),
('2019-11-20', '2019-12-01', 1, 3),
('2019-10-21', '2019-11-05', 2, 3),
('2019-10-20', '2019-11-01', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 5, 'Awesome place, and a very cool owner!'),
(3, 2, 2, 5, 'Juan is the best host and he is so handsome too!'),
(1, 3, 4, 2, 'That place was not clean and the owner did not help!');