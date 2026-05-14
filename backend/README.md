## Environment Setup

Create a `.env` file in the root directory and add:

PORT=5000

DB_NAME=rback_food_ordering_db
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=any_random_secret

this is how you run this project

npm install
npm run db:setup
npm run dev
