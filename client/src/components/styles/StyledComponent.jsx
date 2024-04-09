import { styled } from '@mui/material'

export const VisuallyHiddenInput =styled("input")({
    overflow:'hidden',
    clip:"rect(0,0,0,0)",
    whiteSpace:"nowrap",
    position:'absolute',
    height:1,
    width:1,
});
