import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ContextConfig } from '../Context';

const theme = createMuiTheme({
    typography: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '600',
        padding: '0 16px',
    },
});

const useStyles = makeStyles((theme) => ({
    video: {
        width: '560px',
        [theme.breakpoints.down('xs')]: {
            width: '300px',
        },
    },
    gridContainer: {
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    paper: {
        padding: '12px 24px',
        backgroundColor: '#1d2635',
        color: '#fff',
        margin: '10px',
        borderRadius: '16px',
    },
}));

const VideoPlayer = ({ userName }) => {
    const { acceptCall, myVideo, peerVideo, endCall, stream, call } =
        useContext(ContextConfig);
    const classes = useStyles();

    return (
        <MuiThemeProvider theme={theme}>
            <Grid container className={classes.gridContainer}>
                {stream && (
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>
                                {userName || 'Name'}
                            </Typography>
                            <video
                                playsInline
                                muted
                                ref={myVideo}
                                autoPlay
                                className={classes.video}
                            />
                        </Grid>
                    </Paper>
                )}
                {acceptCall && !endCall && (
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>
                                {call.name || 'Name'}
                            </Typography>
                            <video
                                playsInline
                                ref={peerVideo}
                                autoPlay
                                className={classes.video}
                            />
                        </Grid>
                    </Paper>
                )}
            </Grid>
        </MuiThemeProvider>
    );
};

export default VideoPlayer;
