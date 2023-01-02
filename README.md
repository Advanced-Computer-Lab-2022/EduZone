# EduZone

Eduzone is a dynamic online learning platform that empowers trainees to pursue their educational goals, instructors to share their expertise, and businesses to invest in the professional development of their employees. With an intuitive interface and a wide range of courses, Eduzone offers a unique opportunity for all users to expand their knowledge and skills in an engaging and flexible environment.

## Motivation

Eduzone was founded with the vision of fostering the sharing of knowledge and expertise among educators and learners globally, while also providing a premium experience for all users. Our platform was designed to facilitate the exchange of ideas and insights, and to create a seamless and enjoyable learning environment.

## Build Status

Eduzone is currently in the development phase, during which we are actively creating and improving the various features of the platform.

## Code Style

The Eduzone project is structured with a frontend and backend. The backend consists of API routes that are divided into routes and their corresponding controllers/services, and database models that are implemented using mongoose schemas. The frontend is divided into pages and components, with pages containing the overall page structure and individual components, and components including both common components and components specific to various entities and features. The frontend state is managed using the redux state management system and is persisted in local storage to prevent data loss. The entire project is built using the TypeScript language to ensure type safety and bug-free development. The project is also maintained using tools such as husky, eslint, and prettier to ensure that all commits adhere to established formatting standards and undergo type checking before being executed.

## Screenshots

<img src='./images/home.png' />
<img src='./images/404.png' />
<img src='./images/profile.png' />
<img src='./images/inst-dashboard.png' />

## Framework

The framework used in development is the MERN stack.
The MERN stack is a popular stack of technologies for building web applications. It consists of four main components:

1. MongoDB: A NoSQL database that stores data in a flexible, JSON-like format.
2. Express: A web application framework for Node.js that is used to build the backend of a web application.
3. React: A JavaScript library for building user interfaces.
4. Node.js: A JavaScript runtime that allows developers to run JavaScript on the server-side.

## Extra Features

## Code Example

## Installation

To install the project and all its dependencies run:

```bash
    npm install:all
```

if anything went wrong run the following:

```bash
    npm install
    cd frontend/
    npm install
    cd ../backend
    npm install
```

## API References

## Tests

The testing phase of the project has not yet begun, so no tests have been run.

## How to use

To start the project in development mode run

```bash
    npm run dev
    #this starts the develpoment servers for both frontend and backend
```

to start the project in production mode run:

```bash
    npm start
```

> Make sure to have access to the env files in order to be able to run the project

## Environment Variables

#### Frontend

```bash
REACT_APP_BASE_URL='http://localhost:4000' #or your base url
REACT_APP_EXCONVERTER_API_KEY='<exconvert-currency-converter-api-key>'
VITE_STRIPE_PUBLISHABLE_KEY = '<stripe-publishable-key>'
VITE_TINY_API_KEY='<tinymce-richtext-editor-api-key>'
```

#### Backend

```bash
MONGO_URI='<mongodb-url>' #localsever: mongodb://localhost:27017/db_name
JWT_ACCESS_SECRET='<access-secret>'
JWT_REFRESH_SECRET='<refresh-secret>'
YOUTUBE_API_KEY='<youtube-api-secret>'
MAILER_HOST='smtp.mailgun.org'
MAILER_USER='<mailgun-user>'
MAILER_PASS='<mailgun-pass>'
STRIPE_SECRET_KEY='<stripe-secret-key>'
```

## License

This project is licensed under the MIT License. For further information, please refer to the LICENSE file.
