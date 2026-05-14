import pool from "../config/db.js";

const seedData = async () => {
  try {
    await pool.query(
      `
            INSERT INTO restaurants
                (restaurant_name,country)
            VALUES
                ('Dominos', 'india'),
                ('KFC', 'india'),
                ('Haldirams', 'india'),
                ('McDonalds', 'america'),
                ('Burger King', 'america'),
                ('Subway', 'america')
            ON CONFLICT (restaurant_name) DO NOTHING
            `,
    );

    await pool.query(
      `
        INSERT INTO menu_items(restaurant_id, item_name, item_price)
        VALUES
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Dominos'), 'Farmhouse Pizza', 299),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Dominos'), 'Peppy Paneer Pizza', 249),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Dominos'), 'Veg Extravaganza', 349),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Dominos'), 'Cheese Burst Pizza', 399),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Dominos'), 'Garlic Breadsticks', 129),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Dominos'), 'Choco Lava Cake', 99),

            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='KFC'), 'Chicken Bucket', 499),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='KFC'), 'Zinger Burger', 199),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='KFC'), 'Popcorn Chicken', 249),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='KFC'), 'Hot Wings', 299),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='KFC'), 'Chicken Strips', 279),

            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Haldirams'), 'Raj Kachori', 149),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Haldirams'), 'Chole Bhature', 199),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Haldirams'), 'Pav Bhaji', 179),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Haldirams'), 'Masala Dosa', 149),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Haldirams'), 'Gulab Jamun', 99),

            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='McDonalds'), 'McAloo Tikki', 99),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='McDonalds'), 'McChicken Burger', 149),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='McDonalds'), 'Filet-O-Fish', 199),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='McDonalds'), 'French Fries', 129),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='McDonalds'), 'Coke', 79),

            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Burger King'), 'Whopper', 249),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Burger King'), 'Veg Whopper', 199),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Burger King'), 'Chicken Fries', 189),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Burger King'), 'Onion Rings', 149),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Burger King'), 'Chocolate Shake', 129),

            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Subway'), 'Veggie Delight Sub', 199),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Subway'), 'Chicken Teriyaki Sub', 249),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Subway'), 'Paneer Tikka Sub', 229),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Subway'), 'Tuna Sub', 269),
            ((SELECT restaurant_id FROM restaurants WHERE restaurant_name='Subway'), 'Cold Coffee', 99)

        ON CONFLICT (restaurant_id, item_name) DO NOTHING

        `,
    );

    console.log("Restaurants and menu seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
