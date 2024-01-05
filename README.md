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

- **TypeScript:** 5.3.3 (one does not need to download globally) [Documentation here](https://www.typescriptlang.org/docs/)

- **Apollo Server:** 4.10.0 [Documentation here](https://www.apollographql.com/docs/apollo-server/)

- **GraphQL:** 16.8.1 [Documentation here](https://graphql.org/learn/)

- **Docker:** 24.0.7 [Download here](https://www.docker.com/products/docker-desktop/)

- **PostgreSQL:** 16.1 [Download here](https://www.postgresql.org/download/)

Or **use postgres directly from docker**

Instead of a separate download, one can download the postgres image directly from docker.

`$ docker pull postgres:16.1`

Then, create the container. Remember that the credentials must be the same as the defined in data-source.ts file.

`$ docker run --name <chosen-name> -e POSTGRES_PASSWORD=<chosen-password> -e POSTGRES_USER=<chosen-user> -e POSTGRES_DB=<chosen-db-name> -d -p 5432:5432 postgres:16.1`

## Steps to run and debug

- After cloning the project, run the command below in the root directory:

`$ npm install`

- To compile only, you can run:

`$ npm run tsc`

- With the node_modules folder ready, to start the server run the command below and go to http://localhost:4000/:

`$ npm run start`

- If you want to interact with the database, first it's necessary to run:

`$ docker compose up -d`

**Important:** if it's the firt access to the created container, go to the file src > data-source.ts and check that the property synchronized is set true. This ensures that the not yet known entity will have it's table correctly set up in the database. Keep in mind that to run new migrations it's preferable to set this property to false again.

Then one can use the following script to add an user to the database:

`$ npm run test-typeorm`

In order to stop it, run:

`$ docker compose stop`

Other scripts, to lint and format the files, are defined in the package.json file.
