import { useState } from "react";
import toast from "react-hot-toast";

const CustomMutationHook=(mutationHook)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [data,setData]=useState(null);
    const [hook]=mutationHook();

    const mutateFunction=async(toastMsg,...args)=>{
        setIsLoading(true);
        const toastId=toast.loading(toastMsg || "Updating")

        try{
            const res=await hook(...args);
            if(res.data)
              {
                toast.success(res.data.message || "Updation Successful",{
                    id:toastId
                });
                setData(res.data)
              }
              else{
                toast.error(res?.error?.data?.message || "Something went wrong",{
                    id:toastId
                });
              }
          }
          catch(error)
          {
            toast.error("Something went wrong",{id:toastId});
          }
          finally{
            setIsLoading(false)
          }  
    }
    return [mutateFunction, isLoading, data];
}

export { CustomMutationHook };
