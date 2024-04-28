import { styled } from '@mui/material'
import { Link } from 'react-router-dom';

export const VisuallyHiddenInput =styled("input")({
    overflow:'hidden',
    clip:"rect(0,0,0,0)",
    whiteSpace:"nowrap",
    position:'absolute',
    height:1,
    width:1,
});


export const StyledLink= styled(Link)`
    text-decoration:none;
    color:black;
    height:"1rem";
    &:hover {
        background-color:black;
    }
`;

export const InputBox=styled("input")
({
    width:"100%",
    height:"100%",
    border:"none",
    backgroundColor:"yellow"
})
