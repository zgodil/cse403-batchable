# Batchable - Developer Documentation

## 1. How to obtain the source code
To obtain the Batchable source code, clone the main repository from GitHub using git clone. All system components, including the backend, frontend, documentation, and configuration files, are contained within this single repository.Developers should then create a new feature branch for changes they would like to make before beginning development.

If environment variables are required such as API keys, developers should create a local .env file. Sensitive values should never be committed to version control.

## 2. The layout of the directory structure
The repository is organized into three primary components: infra, frontend, and backend. Each component has a clearly defined responsibility within the system architecture.

The infra directory contains the infrastructure and database configuration for the system. This section handles the creation, initialization, and maintenance of the PostgreSQL database using SQL files. It defines schema setup, table creation, and any required database configuration necessary for the backend to operate correctly.

The frontend directory contains the client-side application and its associated tests. The main application code is located under frontend/app/. Within this directory, the application is structured by concern: api/ contains frontend API wrappers that communicate with the backend, components/ contains reusable UI components, domain/ defines shared types and domain-level logic, routes/ contains route-level pages and navigation logic, and util/ stores general utility functions used throughout the frontend. Static assets are located under frontend/public/. Frontend tests are located under frontend/test/ and mirror the structure of the application layer.

The backend directory contains the server-side application implemented in Java. The primary source code resides in backend/src/main/java/. This layer contains the core application components, including the controllers that define HTTP endpoints, the services layer that implements business logic, and the database manager responsible for interacting with the persistence layer. -- fill in the requistie parts for the folders of the backend


## 3. How to build the software
Batchable uses Maven as its build system. To build the software, ensure that Java version 17 and Maven are installed on your system. Ensure Docker is running and execute docker compose up to start PostgreSQL.

Put the add your .env file in the root of the project with your Google, Twilio API keys, and Database URL.
Then, while still in the root, execute the following in a sh-compatible terminal:

```bash
# in project root
chmod +x ./vars.env
chmod +x ./run.sh
chmod +x ./build.sh
./build.sh
./run.sh
```
and go to: http://localhost:5173

## 4. How to test the software
Still filling in


## 5. How to add new tests
Still filling in


## 6. How to build a release of the software
Still filling in

