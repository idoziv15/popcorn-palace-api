# Popcorn Palace API - Instructions

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
  - [Movies](#movies)
  - [Showtimes](#showtimes)
  - [Bookings](#bookings)
- [Testing the API](#testing-the-api)
- [Environment Variables](#environment-variables)
- [Common Issues & Fixes](#common-issues--fixes)

---

## Project Overview
Popcorn Palace API is a movie booking system built using **NestJS** with **TypeORM** and a **PostgreSQL database**.  
The project uses **Docker** and **Docker Compose** for easy setup and deployment.

---

## Prerequisites
Ensure you have the following installed on your system:
- **Docker**
- **Docker Compose**
- **Git**
- **cURL** or **Postman** for API testing

---
## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd popcorn_palace_typescript

2. Ensure you have Docker and Docker Compose installed.

3. Create an .env file in the root directory and add the following (or modify existing ones):
     ```bash
     DATABASE_HOST=popcorn-palace-db
     DATABASE_PORT=5432
     DATABASE_USER=popcorn-palace
     DATABASE_PASSWORD=popcorn-palace
     DATABASE_NAME=popcorn-palace

## Running the Project
Start the application using Docker Compose:
```bash
docker-compose up --build
```
This will:
- Build the API service
- Start the PostgreSQL database
- Run database migrations (if configured)


Once running, the API should be accessible at:
```bash
http://localhost:3000
```

To stop the project:
press ```^c```

then:
```bash
docker-compose down
```

## API Endpoints
### Movies
#### Create a new movie
```bash
curl -X POST http://localhost:3000/movies \
     -H "Content-Type: application/json" \
     -d '{
       "title": "movie_title",
       "genre": "Action",
       "duration": 90,
       "rating": 8.8,
       "releaseYear": 2010
     }'
```
Replace with the movie details you desired.

#### Get all movies
```bash
curl -X GET http://localhost:3000/movies/all
```

#### Update a movie
```bash
curl -X PUT http://localhost:3000/movies/movie_id \
     -H "Content-Type: application/json" \
     -d '{ "title": "Updated Title" }'
```
Replace movie_id with actually movie id that you would like to update. Same for the details you would like to update (You can add more fields of movie to update).

#### Delete a movie
```bash
curl -X DELETE http://localhost:3000/movies/movie_id
```
Replace movie_id with actually movie id that you would like to delete.

### Showtimes
#### Create a showtime
```bash
curl -X POST http://localhost:3000/showtimes \
     -H "Content-Type: application/json" \
     -d '{
       "movieId": movie_id,
       "theater": "theater_name",
       "startTime": "2025-03-20T18:30:00.000Z",
       "endTime": "2025-03-20T20:30:00.000Z",
       "price": movie_price
     }'
```
Replace fields values according to your desire.

#### Get all showtimes
```bash
curl -X GET http://localhost:3000/showtimes/all
```

#### Get showtime by Id
```bash
curl -X GET http://localhost:3000/showtimes/showtime_id
```
Replace showtime_id with actually showtime id that you would like to fetch.

#### Update a showtime
```bash
curl -X PUT http://localhost:3000/showtimes/showtime_id \
     -H "Content-Type: application/json" \
     -d '{ "theater": "newTheater" }'
```
Replace showtime_id with actually showtime id that you would like to update. Same for the details you would like to update (You can add more fields of showtime to update).

#### Delete a showtime
```bash
curl -X DELETE http://localhost:3000/showtimes/showtime_id
```
Replace showtime_id with actually showtime id that you would like to delete.

### Bookings
#### Create a booking
```bash
curl -X POST http://localhost:3000/bookings \
     -H "Content-Type: application/json" \
     -d '{
       "showtimeId": 1,
       "customerName": "John Doe",
       "seats": 2,
       "seatNumber": 15,
       "userId": "550e8400-e29b-41d4-a716-446655440000"
     }'
```
Replace fields values according to your desire.

#### Get all bookings
```bash
curl -X GET http://localhost:3000/bookings/all
```

#### Update a booking
```bash
curl -X PUT http://localhost:3000/bookings/booking_id
```
Replace booking_id with actually booking id that you would like to Update.

#### Delete a booking
```bash
curl -X DELETE http://localhost:3000/bookings/booking_id
```
Replace booking_id with actually booking id that you would like to delete.


### Testing the API
Run tests inside the container

```bash
docker exec -it popcorn-palace-api npm test
```

Run tests locally (if dependencies are installed)

```bash
npm run test
```

### Environment Variables
The application uses an .env file to configure database settings. Here’s what the .env file should contain:
```
DATABASE_HOST=popcorn-palace-db
DATABASE_PORT=5432
DATABASE_USER=popcorn-palace
DATABASE_PASSWORD=popcorn-palace
DATABASE_NAME=popcorn-palace
APP_PORT=3000
```
Modify these values as needed.

### Common Issues & Fixes
1. Error: "Postgres package has not been found installed"

     Fix: Ensure the pg package is installed inside the container.

```bash
docker exec -it popcorn-palace-api npm install pg
```

2. Error: "Cannot connect to database"

     Fix: Ensure the database container is running:

```bash
docker ps
```

### Testing the API
To ensure the Popcorn Palace API is functioning correctly, you can run different types of tests. There are unit tests and e2e tests i provided for this API.
You can run the test file like that:
- Make sure the API is running (after docker-compose up --build command)
- then sinple open another terminal and run:
     ```bash
     docker exec -it <the_api_container_name> npx jest src/test --runInBand --verbose
     ```
- Replace <the_api_container_name> with your acutal container name.