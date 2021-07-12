import { React, useState } from 'react';
import { useHistory } from 'react-router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';

const theme = createMuiTheme({
    typography: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '600',
        padding: '0 16px',
    },
});

const useStyles = makeStyles((theme) => ({
    heading: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '3rem',
        margin: '12px 0',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: '24px 0',
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    input: {
        color: '#fff',
        borderBottom: '1px solid #6264a7',
    },
    inputLabel: {
        color: '#9ea2ff',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login() {
    const classes = useStyles();

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    };

    const handlePassword = (e) => {
        const newPass = e.target.value;
        setPassword(newPass);
    };

    const goToRegister = () => {
        history.push('/register');
    };

    const loginUser = async (e) => {
        e.preventDefault();
        await axios({
            method: 'POST',
            url: `http://localhost:8000/api/auth`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => {
                history.push('/home');
                window.location.reload();
                localStorage.setItem('usertoken', res.data.token);
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data.msg);
                }
                console.log(err);
            });
    };

    return (
        <MuiThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        className={classes.heading}
                    >
                        Login
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            value={email}
                            onChange={handleEmail}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            color="secondary"
                            className={classes.textField}
                            InputProps={{
                                className: classes.input,
                            }}
                            InputLabelProps={{
                                className: classes.inputLabel,
                            }}
                        />
                        <TextField
                            value={password}
                            onChange={handlePassword}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            color="secondary"
                            className={classes.textField}
                            InputProps={{
                                className: classes.input,
                            }}
                            InputLabelProps={{
                                className: classes.inputLabel,
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                            onClick={loginUser}
                        >
                            LOGIN
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link
                                    variant="body2"
                                    onClick={goToRegister}
                                    style={{
                                        cursor: 'pointer',
                                        color: '#599aba',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        </MuiThemeProvider>
    );
}
