const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Sorry, Please try again";
    err.statusCode=err.statusCode || 500;
    
    if(err.code === 11000)
        {
            const errorField=Object.keys(err.keyPattern).join(",")
            err.message=`Duplicate field ${errorField}`
            err.statusCode=409;
        }

    if(err.name==="CastError")
        {
            const path=err.path
            err.message=`Invalid format of ${path}`
            err.statusCode=409;
        }

    return res.status(err.statusCode).json({
        success:false,
        message:err.message, 
    })
}


const tryCatch=(func)=> async(req,res,next)=>{
    try{
        await func(req,res,next);
    }
    catch(error)
    {
        next(error);
    }
}


class customError extends Error{
    constructor(message,statusCode)
    {
        super(message);
        this.statusCode=statusCode;
    }
}

export {errorMiddleware,tryCatch,customError};