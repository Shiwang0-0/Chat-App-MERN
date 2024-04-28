const fileFormat=(url="")=>{
    const fileExt=url.split('.').pop();

    if(fileExt==="mp4" || fileExt==="webm" || fileExt==="ogg")
        return "video"

    else if(fileExt==="mp3" || fileExt==="wav")
        return "audio"

    else if(fileExt==="jpg" || fileExt==="jpeg" || fileExt==="png" || fileExt==="gif")
        return "image"
    else   
        return "file"
}

export const transformImage=(url="")=>url

export {fileFormat}