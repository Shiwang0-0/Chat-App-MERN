import { useEffect } from "react";
import toast from "react-hot-toast";


const useErrors=(errors=[])=>{

    useEffect((error,isError,fallback)=>{
        if(isError)
        {
            if(fallback)
                fallback();
            else
                toast.error(error.message || "Somehing went wrong")
        }
    },[errors])
}

export {useErrors};