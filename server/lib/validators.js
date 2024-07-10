import { body, param, validationResult } from "express-validator";
import { customError } from "../middlewares/error.js";


const validationHandler=(req,res,next)=>{
    const error= validationResult(req)
    const errorMessage=error.array().map((i)=>(i.msg)).join(" ,");

    if(error.isEmpty())
        return next();
    else
        next(new customError(errorMessage));
}

const registerValidator=()=>[
    body("name","Please enter name").notEmpty(),
    body("username","Please enter username").notEmpty(),
    body("password","Please enter password").notEmpty()
]

const loginValidator=()=>[
    body("username","Please enter username").notEmpty(),
    body("password","Please enter password").notEmpty()
]

const createGroupValidator=()=>[
    body("name","Please enter group name").notEmpty(),
    body("members").notEmpty().withMessage("Please add some members").isArray({min:2, max:50}).withMessage("members must be between 2-100")
]


const addMemberValidator=()=>[
    body("chatId","Please enter chatId").notEmpty(),
    body("members").notEmpty().withMessage("Please add some members").isArray({min:1}).withMessage("Please add some members")
]

const chatIdInParamValidator=()=>[
    param("id","Mongo Id is expected").notEmpty(),
]

const removeMemberValidator=()=>[
    body("chatId","Please enter chatId").notEmpty(),
    body("userId","Please enter userId").notEmpty(),
]

const sendAttachmentValidator=()=>[
    body("chatId","Please enter chatId").notEmpty(),
]

const renameGroupValidator=()=>[
    param("id","Mongo Id is expected").notEmpty(),
    body("name","Please enter name").notEmpty()
]

const requestSenderValidator=()=>[
    body("userId","Please enter userId").notEmpty()
]

const requestAcceptorValidator=()=>[
    body("requestId","Please enter requestId").notEmpty(),
    body("accept").notEmpty().withMessage("Please enter accept").isBoolean().withMessage("accept should be boolean")
]

export { addMemberValidator, chatIdInParamValidator, createGroupValidator, loginValidator, registerValidator, removeMemberValidator, renameGroupValidator, requestAcceptorValidator, requestSenderValidator, sendAttachmentValidator, validationHandler };
