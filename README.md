# Lovely Stay

A small project written in `typescript` to fetch users from GitHub and produce a database associated with the programming languages that they know.

The project is divided into 4 main directories:
- database, which contains the migrations and the models/entities that access the database.
- presentation, where in this case, the CLI code is. However, if you want to add the rest of the endpoints, here would be the right place.
- services, the layer of abstraction where business logic lives. It is where the main decisions regarding the project lay.
- tests, the test package, where the function and functionalities of the project are tested.

The `app.js` is the main file of the project.

## Features

- Fetch a user
- Load all the users on the database
- Search a user by location
- Search a user by programming language
- Search user by location and programming language
- Display all the information regarding a specific user already on the db

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory.

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Change DB_PASSWORD on .env file

Start the database

```bash
  docker compose up --build -d
```

Build the project

```bash
    npm run build
```

Load the environmental variables
```bash
    set -a
    source ./src/tests/.env
    set +a
```

Run the project using the commands in the following section.

## Running Tests

There are some tests associated with this project, although, a little bit more are needed. To run the tests, execute the following command

```bash
  npm run test
```

## CLI interface for the project

After building the project you can use the following commands to run it:

```javascript
// Fetch user from github/database
node app.js -f <username>
```

```javascript
// Display all users on the database
node app.js -d
```

```javascript
// Search user by location
node app.js -l <location>
```

```javascript
// Search user by programming language
node app.js -pl <programming-language>
```

```javascript
// Search user by programming language and location
node app.js -pl <programming-language> -d <location>
```

## Considerations

This is a simple project, so concerns about scaling were thought, but I did not apply them. The project was made and think in terms of visibility, so we document errors with logs and provide some debug logs to be enabled in a staging environment. That way it facilitates debugging when a production error appears.

On the other hand, while developing the project, multiple types of tests were added - unit, integration, and "E2E". Even the CLI library was tested. I called them E2E tests, although, a true E2E test, would be done by software like `jmeter`.

The database chosen was `postgreSQL`. The choice between NoSQL and SQL was easily done, due to the quality of data that we are dealing with. The entities can easily build relations between themself. Once there is a need to grow the project and more tables appear, a relation database seems like a good choice.

Even in the topic of databases, the use of `elasticsearch` was thought to index and search locations. Although I could not justify spinning up a new entity only for that requirement. In a production-like environment, it would cost more money and at least 2 more dependencies to maintain (the `elasticsearch` and something to do `change data capture`). On the other hand, if more search requirements appear in the future, adding a search database would be a good approach.

Regarding optimization, there are little optimizations done, like a `bulk insert` on the database for when inserting programming languages and some mechanism to not request GitHub every time a user is fetched. If a user was fetched less than a delta, for example, a day, we return the user from the database and assume that it is the most recent data about this user. 

In terms of the next steps, I would add `Prometheus` metrics and spin up `grafana` to gather logs, and the metrics and build some dashboards. These dashboards can illustrate the load of the system and also paint a path on how much this application is used, so a scaling strategy can be defined. I also would add `eslint` on push as long as `prettier`. Finally, I would build a CI/CD and run the tests there.

## Project corrections v2.0

- [DONE] Sensitive data on docker-compose => Used to load variables from .env file and commit it to github without the passwords. This way, before running the project you would also need to write new passwords on .env file.

- [DONE] There is no .env.sample in your codebase and you refer to it in the readme => Although I use .env to run the project locally, there is another purpose for this file. The .env file is under the tests directory, so I would load it, once I created a dedicated container for running tests on the CI/CD. 

- [DONE] The node version is missing => added to `package.json`.

- [DONE] No input data validation -> Will use `zod` as schema input validation.

- [DONE] The Readme has some errors -> Corrected

- [DONE] There is one test failing. -> Corrected

- [DONE] The languages are not being listed => I created an endpoint for describing the users. A cleaner way to it is to show when listing and searching for users. Althought, it is a cli application, so if you get more users and programming languages it can became a little bit confusing, so this approach would give a better user experience. Another alternative, if we were dealing with for example an API is to provide some sort of `pagination`.

- [DONE] The function fetchUserFromGithub does not follow the single responsibility principle, it's doing way more than just fetch the GitHub user -> Change the name of function to `fetchOrUpdateUserFromGithub` and added a second one `isUserUpdated` to do the logic of deciding if a user needs to be updated.

