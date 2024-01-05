## Onboard Backend - João Pedro Arroyo

## Project Description

This project serves as an introduction to some of the basics of backend, such as patterns,
the technology stack, best practices adopted by the team, how to store data in a database
and use CRUD operations on it.

## Environment and tools

- **Operating System:** Ubuntu 22.04.1 (Jelly)

- **nvm**: 0.39.3 [Download here](https://github.com/nvm-sh/nvm)

- **node.js:** v18.16.0

Can be downloaded with: `$ nvm install 18.16.0`

- **npm:** 9.5.1

- **PostgreSQL:** 16.1 [Download here](https://www.postgresql.org/download/)

- **TypeScript:** 5.3.3 (one does not need to download globally)

- **Apollo Server:** 4.10.0 [Link to Apollo Server](https://www.apollographql.com/docs/apollo-server/)

- **GraphQL:** 16.8.1 [Link to GraphQL](https://graphql.org/)

- **Docker:** 24.0.7 [Download here](https://www.docker.com/products/docker-desktop/)

## Steps to run and debug

- After cloning the project, run the command below in the root directory:

`$ npm install`

- To compile only, you can run:

`$ npm run tsc`

- With the node_modules folder ready, to start the server run the command below and go to http://localhost:4000/:

`$ npm run start`

- If you want to interact with the database, first it's necessary to run:

`$ docker compose up -d`

Then one can use the following script to add an user to the database:

`$ npm run test-typeorm`

In order to stop it, run:

`$ docker compose stop`

Other scripts, to lint and format the files, are defined in the package.json file.
