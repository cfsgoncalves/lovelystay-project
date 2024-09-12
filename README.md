
# Lovely Stay

A small project written in `typescript` to fetch users from github a produce a database associated with the programming languages that they know.

The project is divided in 4 main directories:
- database, where it cotains the migrations and the models/entities that acess the database.
- presentation, where in this case is where the cli code is. Althought, if you want to add for example rest enpoints, here would the write place.
- services, the layer of abstraction where business logic lives. It is where the main decisions regarding the project lay.
- tests : the test package, where the function and functionalities of the project are tested.

The `app.js` is the main file of the project.

## Features

- Fetch a user
- Load all the users on the database
- Search a user by location
- Search a user by programming language
- Search user by location and programming language

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the database

```bash
  docker compose up --build -d
```

Build the project

```bash
    npm run build
```

Load the enviromnent variables
```bash
    set -a
    source ./test/.env
    set +a
```

Run the project using the commands on the following section.

## Running Tests

There are some tests associated with this project, althought, a little bit more are needed. To run test, execute the following command

```bash
  npm run test
```

## Cli interface for the project

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

This is a simple project, so concerns about scaling where thought, but not apply. The project was made and think in terms of visibility, so we document errors with logs and provide some debug logs to be enable in a staging enviroment. That way it facilites debugging when a production error appears.

On the other hand, while developing the project, multiple types of tests where added - unit, integration and "E2E". Even the cli library was tested. I called them E2E tests, although, a true E2E test, would be done by a software like `jmeter`.

The database chosen was `prostgreSQL`. The choice between NoSQL and SQL was easily done, due to the quality of data that we are dealing with. The entities can easily build relations between themself. And once there is a need to grow the project and more tables appear, a relation database seams like a good choice.

Even in the topic of databases, the use of `elasticsearch` was thought with the objective to index and search locations. Althought I could not justify spining up a new entity only for that requirement. In a production like enviroment, it would cost more money and at least 2 more dependency to maintain (the `elasticsearch` and something to do `change data capture`). On the other hand, if more search requirements appear in future, adding a search database would be good approach.

Regarding optimization, there are a little optimizations done, like a `bulk insert` on the database for when inserting programming-languages and some mechanist to not requesting github everytime a user is fetch. If a user was fetched less than a delta, for example a day, we return the user from the database and assume that it is the most recent data about this user. 

In terms of next steps, I would add prometheous metrics and spin up `grafana` to gather logs, the metrics and build some dashboards. This dashboards can ilustrate the load of the system and also paint a path on how much this application is used, so a scaling strategy can be defines. I also would add `eslint` on push as long as `prettier`. Finally, I would build a CI/CD and run the tests there.