const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Sorry, Please try again";
    err.statusCode=err.statusCode || 500;

    return res.status(err.statusCode).json({
        success:false,
        messages:err.message, 
    })
}


const tryCatch=(func)=> async(req,res,next)=>{
    try{
        func(req,res,next);
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