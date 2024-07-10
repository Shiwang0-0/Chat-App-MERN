export const getOrSaveFromStorage=({key,value,isGet})=>{
    if(isGet)
            return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):null
    else
        localStorage.setItem(key,JSON.stringify(value))
}