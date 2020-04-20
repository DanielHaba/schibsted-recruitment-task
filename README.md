# Shibsted - Recruitment task

## Goal
Your task is to create a simple issue tracker - both backend and frontend side. An issue should
have a title, description and one of three states: open, pending and closed. Once an issue is
pending it cannot be set back to open, similarly if an issue is closed it cannot be set back to
pending or open. The minimal requirement is to provide a list view where you can see the
issues and change their state.
A couple of things we would like you to consider when writing this application:
- Use JavaScript (can be transpiled, but don't go crazier than ECMA stage 3)
- You can use any library or framework that you want as long as it's reasonable, but do
not overcomplicate things
- The code should be testable
- Keep the code clean and understandable (document it if you feel it's needed)
- Do not sacrifice code quality for the sake of completeness of the task

## Assumptions
I decided to write this app as low as possible but I don't have infinite time so I have to use some of the libraries. Requirements say that I have to use javascript. Requirements also say that code can be transpiled. I was confused, can I use TypeScript or not? I decided to take a risk and write the application in it. Probably I'm digging my own grave because I'm breaking rules but TypeScript is not a different language. It's a subset of JavaScript, much harder due to configuration, types writing and maintaining. In application logic, there is no difference between pure JavaScript and TypeScript stripped from types. Of course, it brings a few new features (except of types) which I decided not to use (in few exceptions explained in code). I think that  I explained my motivation for using TypeScript, so let's move on.
I'm creating a web app so I need an HTTP server, an HTTP client (which is a web browser but I'm thinking of browser plus additional code as some kind of standalone application) and database. For the server I'm using express because it's easy to learn and understand, in addition many of Node.js developers started with this. For the database I decided to use mongoDB because nosql perfectly fits in JavaScript style and mongo is also commonly used by new developers (senior devs use it too). Maybe I should use mongoDB directly, but when the application will become bigger it will be harder to maintain. I chose to use mongoose which is a library for higher-level database management. For frontend, I could go into jade or another template engine but I thought it will be too easy, so I created React application for frontend. Frontend app is written in TypeScript, unfortunately browsers can't understand languages other than JavaScript and Wasm. I have to transpile code before sending it to the browser. It's possible to transpile code at runtime in browser but static transpilation will be fine for this project and I don't want to overcomplicate. Probably the most common way to process code and assets of web app is webpack therefore this is the reason why I'm using it. I have to test my application, writing tests in pure JavaScript is possible, but it's unpleasant and time-consuming. I took my favorite testing duo - mocha as testing framework, and chai for assertions. Because app is small there are not many functionalities that I could check by unit tests. Most of the logic will be in the HTTP server controllers so I need integration tests. As an HTTP testing framework I chose supertest. Alright then, I think we are done with requirements. I skip session, cache, authorization, react tests and functional tests and probably many more features which web application should have but I don't have enough time. I did logging because I needed it for testing and debugging (I used winston which is easy to set up and have plugin for express). There is another thing. I want to the application will run on every computer, without a complicated setup process, installing services and long hours of debugging why it's not working. As a person who reviews other's code I know that pain when you have to spend a few hours of preparing just for a quick check. I also don't like to treat computers as trash cans, I decided to use Docker as a virtualization engine. That gives many advantages in cases of automatic testing and application deployment but it's out of a scope of this task. 

## Setup 
### Without Docker
When running outside of Docker environment. We need to set some of the environment variables:
```
export APP_PORT={application port}
export APP_DATABASE_HOST={mongoDB host}
export APP_DATABASE_USER={mongoDB user}
export APP_DATABASE_PASSWORD={mongoDB password}
export APP_DATABASE_NAME={mongoDB database name}
```
Next we need install dependencies. As package manager I'm using yarn because it's more secure than npm and his cli is much cleaner in my opinion.
```
yarn install
```
Also we need to prepare frontend bundle:
```
yarn webpack
```
When we are ready we can run this application:
```
APP_TRANSPILE_RUNTIME=1 yarn start
```
Note: We are did not transpiled TypeScript code into JavaScript so we need to set flag APP_TRANSPILE_RUNTIME to 1. This allows us to work directly on ts files, that is useful for development but we could convert code into JavaScript and it would work either.
To run tests we simply type this into console:
```
yarn test
```
### With Docker
I'm assuming that You have Docker and Docker-Compose on your machine. To run it we just type this into console:
```
docker/up
```
To cleanup docker containers we need to run:
```
docker/down
```
Warning: In docker-compose.yml I'm mounting static directory onto docker container, so if you don't have `static/bundle.js` file, frontend will crash. To fix it we need to run `yarn webpack` command. Mounting allows us to event run `yarn webpack --watch` and page will be updated without rebuilding container. That cluster is suited only for development.
## Next steps
As I mentioned earlier, this application is very simple but I could make it better. Here is few ideas: 
 - We should allow only the creator of the issue to modify title and description. That requires authentication and authorization. That brings us to point when we need to implement a session and some kind of session key which is sent to the server in every request. I would use jwt because it's small and simple to implement.
 - When traffic increases this app can slow down because every request is processing from start. We need to implement a cache mechanism to speed up page a little bit, We could go into Redis which is a simple key-value database. Also, we could add full-page caching, I recommend to use Varnish for this. Yes it's separated service but it allows to filter requests before they are sent to the application. It also supports load-balancing which is required when we decide to create more than one application server.
 - Next fact, validation in this task is very simple and I need it only for one controller. To not overcomplicate application I decided to skip searching for validation libraries. But when the application becomes bigger it will be more difficult to maintain. If we use framework writing conditions will be simpler and quicker. Also code will be more readable so we don't have to diagnose why those conditions are not meet.
 - There is also the frontend side. This application is rendered only in the browser so clients who have disabled JavaScript in their browsers can not use this app. We need to introduce backend rendering which makes page accessible even for robots. Another thing is the page structure. We have simple architecture when data is flowing from parents into children but it's not always the case. For example we could have a sidebar with recent issues separated from the main content. To handle this case we could introduce data stores for React.
 - In application design we could add responses to the issues, dates when it was created and updated and author of the issue. It will be cool when the developer or project manager could assign issues to the specified person. Pages for my issues will help people to work with. Also we need to apply filters, sorting and pagination to standard-issue list view. Maybe we could use elasticsearch as a database for better searching.
 - In code structure we could be more restricted. We will have backend and frontend code which cannot be mixed, but there is a chance that we need the same code for both backend and frontend. The division between code will help to keep code clean and small, there is also a lower chance to leak some critical information. In TypeScript we could use composite build which helps us to handle code differencing.

#### Thanks for reading