# Chat-App-MERN

## Run Locally
Step 1: Clone the Repository
Step 2: Go the Cloned folder
Step 3: In the CHAT-APP-MERN folder type cd client
Step 3.1: In the server folder, create .env file and add the following 
            VITE_SERVER = http://localhost:3000
Step 4: run command npm install and then npm run dev
Step 5: Split the terminal
Step 6: In the CHAT-APP-MERN folder type cd server 
Step 6.1: In the server folder, create .env file and add the following 
            MONGO_URI = type your mongoose connection string here
            PORT = 3000
            JWT_SECRET= "type your jwt secret here"
            CLIENT_URL= not needed until you are hosting the application
            CLOUDINARY_CLOUD_NAME= type your cloudinary name here
            CLOUDINARY_API_KEY= type your cloudinary api key here
            CLOUDINARY_API_SECRET= type your cloudinary secret here
Step 7: run command npm install and then npm run dev
Step 8: Open Browser,go to localhost:5143


---------------------------------------------------------------------------------------------------------

The Project is made with the use of MERN Stack.

# Frontend
The Frontend of the project is build using React-JS and the styling is done using Material UI (MUI). It implements the use of features provided by ReactJS including React Hooks, React Routing.

#### Socket Connection
A real time interface between the users using the application is made using Socket Connection. The Project made use of Socket.io for the Socket Connection.

#### State Management
The Variables state across the application is one main task of a chat application. Here, In this project It is implemented using Redux Toolkit which ensures proper State Management of needed variables across the application.



# Backend
The Backend of the project is build using Node JS and Express JS where for Database MongoDB is begin used. Web Server is created using Express JS and all the Controller functions, routes are implemented using Node JS.
Cloud Storage
The Project uses Cloudinary as a cloud storage to store User’s Avatar, and attachments sent by user in the Chat.



#### Authentication And Authorization
User’s Authentication and Authorization across the application is done using Json Web Token and Express Validator, It ensures that Unauthenticated user cannot access the data from the Database and only Authorized user gets his/her respective data.
