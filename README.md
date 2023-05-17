Certainly! Here is your updated README.md:

# be-nc-games

## Description
be-nc-games is a backend server for an application that manages game reviews. It provides various API endpoints to retrieve information about game categories and reviews. This project uses Express.js as the server framework and PostgreSQL as the database.

The backend application is hosted on [Render](https://render.com/), with the PostgreSQL database hosted on [ElephantSQL](https://www.elephantsql.com/). The corresponding frontend application is hosted on [Netlify](https://www.netlify.com/) and can be accessed [here](https://ncgamenexus.netlify.app/).

## Installation
1. Clone the repository
2. Navigate to the project directory.
3. Install the dependencies by running the following command:
   ```
   npm install
   ```

## Usage
To start the server locally, run the following command:
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

For local development and testing, ensure that you have PostgreSQL installed and running locally. Update the `.env.development` and `.env.test` files with your local database names.

## Testing
To run the tests, use the following command:
```
npm test
```

## Deployment
The application is deployed on Render, with the PostgreSQL database hosted on ElephantSQL. The corresponding frontend is hosted on Netlify.

Enjoy using be-nc-games!