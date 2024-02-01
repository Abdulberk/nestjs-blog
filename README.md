# Project Name

A brief description of your project.

## Table of Contents

- [Installation](#installation)
- [Endpoints](#endpoints)
  - [Posts](#posts)
  - [Comments](#comments)
  - [Authentication](#authentication)
  - [Users](#users)
- [License](#license)

## Installation

1. **Node.js Installation:** Make sure [Node.js](https://nodejs.org/) is installed. I highly recommend using the LTS version.

2. **Install Dependencies:** Cloning the repo, in the project root directory, run the following command to install dependencies:

    ```bash
    npm install
    ```

3. **Database Setup:** If using MongoDB or any other database, update the connection details in `.env` file

4. **Environment Variables:** Create a `.env` file and set the required environment variables if you want to switch to your own configs, or you can leave it as is and go on with the default env config which comes out of the box by default just for test purposes. I recommend the second option, switching to that, you wont really need to mess around some MongoDB configs setting up search index config in order to make use of searching feature etc. Now it's just plug-and-play.

    ```env
    JWT_EXPIRATION=86400
    PORT=3000
    MONGODB_URI=mongodb+srv://abdulberk:UvyHBAm3NesMfLEA@cluster0.l1datvw.mongodb.net/?retryWrites=true&w=majority
    JWT_SECRET=c29fdce093d100d98c3cb49f3e95153f6260ecdda8251db4d8d4b8fd5e3a0a35
    ```

5. **Start the Application:** Launch the application with the following commands depending on the environment you wish

    ```bash
    # development
    npm run start
    ```
 
	```bash
	 # watch mode
	npm  run  start:dev
	 ```

	  ```bash
    # production mode
    npm  run  start:prod
    ```

## Endpoints


### Posts

1. **Create Post:**
    - Endpoint: `POST /posts/create-post`
    - Description: Create a new post for an authenticated user.

2. **Get My Posts:**
    - Endpoint: `GET /posts/my-posts`
    - Description: Retrieve all the posts for authenticated user.

3. **Get One Post:**
    - Endpoint: `GET /posts/post/:id`
    - Description: Retrieve details of a specific post for an authenticated user.

4. **Update Post:**
    - Endpoint: `PATCH /posts/update-post/:id`
    - Description: Update the specified post for an authenticated user.

5. **Delete Post:**
    - Endpoint: `DELETE /posts/:id`
    - Description: Delete the specified post for an authenticated user.

6. **Search Posts:**
    - Endpoint: `GET /posts/search?query=your_search_query`
    - Description: Search posts with the specified query for an authenticated user.

### Comments

1. **Add Comment:**
    - Endpoint: `POST /comments/add-comment/:postId`
    - Description: Add a comment to a specific post.

2. **Update Comment:**
    - Endpoint: `PATCH /comments/update-comment/:commentId`
    - Description: Update the specified comment.

### Authentication

1. **Login:**
    - Endpoint: `POST /auth/login`
    - Description: Authenticate and obtain a JWT token.

2. **Register:**
    - Endpoint: `POST /auth/register`
    - Description: Register a new user, note that you won't have access token after a successful register process, meaning you will also need to login to achieve that.

### Users

#### User and Auth Layer Separation

In my application architecture, the decision to separate the `User` and `Auth` layers stems from the need to establish a modular and maintainable structure. This separation optimizes scalability, code clarity, and security, promoting simplicity and efficient development environment. So, the modular structure encourages code reuse and facilitates independent scaling, contributing to a well-organized and secure codebase.

1. **Get User by ID:**
    - Endpoint: `GET /users/get-user/:id`
    - Description: Retrieve user details by ID.



