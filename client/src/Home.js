import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import { ContextConfig } from './Context';
import { useHistory } from 'react-router';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    logoutBtn: {
        alignItems: 'right',
        marginLeft: '80vw',
        marginTop: '12px',
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0',
        },
    },
    appBar: {
        color: '#ffffff',
        margin: '30px 100px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161d29',
        boxShadow: 0,
        [theme.breakpoints.down('xs')]: {
            width: '90%',
        },
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
}));

const Home = () => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const config = useContext(ContextConfig);
    let history = useHistory();

    const handleLogout = () => {
        history.replace('/login');
    };

    useEffect(() => {
        let c = 0;
        const checktoken = async (token) => {
            await axios({
                method: 'POST',
                url: `http://localhost:8000/api/auth/checktoken`,
                headers: {
                    'x-auth-token': token,
                },
                responseType: 'json',
            })
                .then((res) => {})
                .catch((err) => {
                    console.log(err);
                    if (err.response) {
                        c = 1;
                        console.log('error');
                        alert(err.response.data.msg);
                    }
                    history.push('/login');
                });
        };

        checktoken(localStorage.getItem('usertoken'));

        axios({
            method: 'GET',
            url: `http://localhost:8000/api/auth/user`,
            headers: {
                'x-auth-token': localStorage.getItem('usertoken'),
            },
            responseType: 'json',
        })
            .then((res) => {
                setUsername(res.data.name);
            })
            .catch((err) => {
                console.log(err);
                if (err.response && c === 0) {
                    alert(err.response.data.msg);
                    c = 1;
                }
                history.replace('/login');
            });
    });

    return (
        <div className={classes.wrapper}>
            <Button
                className={classes.logoutBtn}
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
            >
                Logout
            </Button>
            <h1 className={classes.appBar}>Microsoft Teams</h1>
            <VideoPlayer userName={username} />
            <div>
                <Button
                    onClick={config.toggleVideo}
                    color={!config.videoCheck ? 'primary' : 'secondary'}
                >
                    {
                        !config.videoCheck ? <VideocamIcon /> : <VideocamOffIcon />
                    }
                </Button>
                <Button
                    onClick={config.toggleAudio}
                    color={!config.audioCheck ? 'primary' : 'secondary'}
                >
                    {
                        !config.audioCheck ? <MicIcon /> : <MicOffIcon />
                    }
                </Button>
            </div>
            <Sidebar>
                <Notifications />
            </Sidebar>
        </div>
    );
};

export default Home;
