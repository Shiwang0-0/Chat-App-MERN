import React from 'react'
import {Helmet} from 'react-helmet-async'


const Title = ({title="Chat App", desc="This is a chat application"}) => {
  return ( 
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc}/>
    </Helmet>
  )
}

export default Title
