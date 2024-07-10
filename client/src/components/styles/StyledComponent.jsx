import { Skeleton, keyframes, styled } from '@mui/material';
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
        border-radius:20px;
    }
`;

export const InputBox=styled("input")
({
    width:"100%",
    height:"100%",
    border:"none",
    backgroundColor:"#023e8a",
    color:"white"
})

const bounceAnimation=keyframes`
0% {tranform: scale(1);}
50% {tranform: scale(1.5);}
100% {tranform: scale(1);}`

export const BouncingSkeleton  =styled(Skeleton)(()=>({
    animation:`${bounceAnimation} is infinite`
}))