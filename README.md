# Chat-App-MERN

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)	![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)


## Run Locally
Step 1: Clone the Repository   

Step 2: Go the Cloned folder   

Step 3: In the CHAT-APP-MERN folder type cd client   

Step 3.1: In the server folder, create .env file and add the following    

            VITE_SERVER = http://localhost:3000   
            
Step 4: run command npm install and then npm run dev   

Step 5: In the CHAT-APP-MERN folder type cd server    

Step 5.1: In the server folder, create .env file and add the following   
 
            MONGO_URI = type your mongoose connection string here   
            
            PORT = 3000   
            
            JWT_SECRET= "type your jwt secret here"   
            
            CLOUDINARY_CLOUD_NAME= type your cloudinary name here   
            
            CLOUDINARY_API_KEY= type your cloudinary api key here   
            
            CLOUDINARY_API_SECRET= type your cloudinary secret here   
            
Step 6: run command npm install and then npm run dev   

Step 7: Open Browser, go to localhost:5143   



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


#### Redis and Pub/Sub
To make the application response fast, Redis is used.
To Scale up the web socket connection, Pub/Sub technique is used with Redis.This ensures that socket servers on different port are subscribed to same data.
( a brief visual representation on how redis pub/sub works in given below )

![redis-pub/sub](https://github.com/Shiwang0-0/Chat-App-MERN/blob/main/client/public/images/redis%3Apub-sub.png)
