import { faker } from "@faker-js/faker";
import { tryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";

const createUser=tryCatch(async(numUsers)=>{
    const users=[];

    for (let i = 0; i < numUsers; i++) {
        const temp=User.create({
            name:faker.person.fullName(),
            username:faker.internet.userName(),
            password:"password",
            avatar:{
                url:faker.image.avatar(),
                public_id:faker.system.fileName()
            }
        })
        users.push(temp);
    }
    await Promise.all(users);
    process.exit(1);
})


export { createUser };

