<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

  <p align="center"><b>Network</b> is a powerful project designed to create your own RESTful API, allowing developers to quickly and efficiently build social networks with posts, users, and comments.</p>

## Description

<p>This project provides a flexible architecture for building a social network where users can create, edit, and delete posts, as well as leave comments on them. By utilizing modern technologies such as Node.js and TypeScript, you can easily adapt the project to meet your needs.</p>

## Key Features

<ul>
  <li>Users: Registration, authentication, and profile management.</li>
  <li>Posts: Create, edit, and delete posts, with the ability to add images.</li>
  <li>Comments: Add comments to posts, with options to edit and delete.</li>
  <li>Likes: Users can like posts and comments, enhancing platform interactivity.</li>
  <li>Filtering: Ability to filter posts by creation date, number of likes, and text.</li>
  <li>Email Notifications: Users receive email notifications for important actions, such as account confirmation and updates.</li>
  <li>Swagger Documentation: Automatically generated API documentation to facilitate integration and testing.</li>
</ul>

## Technologies
<p>The project is implemented using:</p>
<ul>
  <li>Node.js: for building the server-side.</li>
  <li>TypeScript: for type safety and improved code quality.</li>
  <li>NestJS: for building a structured and scalable API.</li>
  <li>PostgreSQL: for data storage.</li>
  <li>TypeORM: for database interaction.</li>
</ul>

## Getting Started
<ol type="1">
  <li>Clone the repository:</li>
```bash
$ git clone https://github.com/Ira-Marysheva/Network.git
```

  <li>Install the dependencies:</li>
```bash
cd Network
npm install
```

  <li>Configure the database settings in the .env file and run Docker-compose.</li>
```bash
docker-compose up
```

<li>Start the server:>
```bash
npm run start
```

<ol>

## Usage
<p>After starting the server, you can use the Swagger UI to test the API by navigating to http://localhost:3000/api.</p>

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Contact

If you have any questions or suggestions, please reach out to me at 380934581587a@gmail.com

## License

<p>This project is licensed under the MIT License.</p>