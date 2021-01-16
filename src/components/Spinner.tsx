
import React from 'react';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    '@keyframes spin': {
        from: {
            transform: 'rotateZ(0deg)'
        },
        to: {
            transform: 'rotateZ(360deg)'
        }
    },
    spinner: {
        borderRadius: '50%',
        animation: '$spin 1s linear infinite'
    }
})

const Spinner = (props: any) => {
    const classes = useStyles();
    return <div className={classes.spinner} style={{
        border: 'solid',
        borderWidth: props.borderWidth || '.4rem',
        background: props.background || '#eee',
        borderColor: props.borderColor || '#8B131D dimgrey dimgrey dimgrey',
        width: props.size || '2rem',
        height: props.size || '2rem'
    }}></div>
}

export default Spinner;