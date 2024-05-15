const emitEvent=(req,event,user,data)=>{
    console.log(`emitting event ${event} ${data}`)
}

export {emitEvent}