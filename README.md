# rise-backend
A backen api built with Node.js, Typescript and Postgres SQL. This app (api) is hosted [here](https://rise-backend.onrender.com/).


# running the app

## running locally

- Clone this repo
- Install dependencies: `npm install`
- Setup a pg db using any of the client app. I used postgres db provision from [Render](https://onrender.com)
- Setup environment variables: create a `.env` file with the database url

```bash
JWT_SECRET=<your secret JWT key>
JWT_EXPIRES=12h
DB_URL=
PORT=5000
REDIS_URL=<your redis url>
```

- If you are using local postgres then your env might look like this
```bash
JWT_SECRET=<your secret JWT key>
JWT_EXPIRES=12h
DB_USER=<db user>
DB_HOST=localhost
DB_PASSWORD=<your password>
DB_PORT=5432
PORT=5000/
DB_NAME=<db name>
REDIS_URL=<your redis url>
```

- Start dev server: `npm run dev`
The app will be available on http://localhost:5000.

## running on docker

- Clone this repo
- Build docker image using docker-compose: `docker-compose up`
The app will be available at http://localhost:5000.

The docker-compose.yml file contains the config to build and run the app using Docker. This allows running the app using Docker without manually building the image.

## testing the app

To run tests on Postman, kindly visit the collection using this [link](https://www.postman.com/0xanon/workspace/rise/collection/11664548-8ea7a201-0b3d-4c8b-ac18-2f1ab8b49457?action=share&creator=11664548)

To run the unit test, run this command:
```
npm run test
```