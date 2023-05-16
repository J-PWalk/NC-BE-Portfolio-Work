# be-nc-games

## Description
be-nc-games is a backend server for an application that manages game reviews. It provides various API endpoints to retrieve information about game categories and reviews. This project uses Express.js as the server framework and PostgreSQL as the database.

## Installation
1. Clone the repository
2. Navigate to the project directory.
3. Install the dependencies by running the following command:
   ```
   npm install
   ```

## Usage
To start the server, run the following command:
```
npm start
```

The server will start running at `http://localhost:3000`.

### Available Endpoints

- `GET /api`\
  Description: Serves up a JSON representation of all the available endpoints of the API.

- `GET /api/categories`\
  Description: Serves an array of all categories.\
  Example response:
  ```
  {
    "categories": [
      {
        "description": "Players attempt to uncover each other's hidden role",
        "slug": "Social deduction"
      }
    ]
  }
  ```

- `GET /api/reviews`\
  Description: Serves an array of all reviews.\
  Query parameters:
  - `category` (optional): Filters reviews by category.
  - `sort_by` (optional): Sorts reviews by a specific column.
  - `order` (optional): Specifies the order of sorting (ascending or descending).\
  Example response:
  ```
  {
    "reviews": [
      {
        "title": "One Night Ultimate Werewolf",
        "designer": "Akihisa Okui",
        "owner": "happyamy2016",
        "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        "category": "hidden-roles",
        "created_at": 1610964101251,
        "votes": 5
      }
    ]
  }
  ```

## Database Configuration
The application uses PostgreSQL as the database. The configuration for different environments can be found in the following files:

- `.env.production`: Contains the production database URL.
- `.env.development`: Contains the development database name.
- `.env.test`: Contains the test database name.

## Testing
To run the tests, use the following command:
```
npm test
```
## Deployment
To deploy this project to a production environment, follow these steps:

1. Set the necessary environment variables for production, such as the database URL and any secret keys.
2. Configure the server or hosting platform with the appropriate settings and dependencies.
3. Run the project using a process manager like PM2 or deploy it to a hosting platform like Heroku.
