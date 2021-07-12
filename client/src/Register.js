import { React, useState } from 'react';
import { useHistory } from 'react-router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
    typography: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '600',
        padding: '0 16px',
    },
});

const useStyles = makeStyles((theme) => ({
    heading:{
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
        margin: '12px 0',
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    input:{
        color: '#fff',
        borderBottom: '1px solid #6264a7',
    },
    inputLabel:{
        color: '#9ea2ff',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Register() {
    const classes = useStyles();

    const history = useHistory();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleName = (e) => {
        const newName = e.target.value;
        setName(newName);
    };

    const handleEmail = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    };

    const handlePassword = (e) => {
        const newPass = e.target.value;
        setPassword(newPass);
    };

    const goToLogin = () => {
        history.push('/login');
    };

    const registerUser = async (e) => {
        e.preventDefault();
        await axios({
            method: 'POST',
            url: `http://localhost:8000/api/users`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                name,
                email,
                password,
            }),
        })
            .then((res) => {
                history.push('/login');
            })
            .catch((err) => {
                alert('Email already taken...');
                console.log(err);
            });
    };

    return (
        <MuiThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AssignmentTurnedInIcon />
                </Avatar>
                <Typography component="h1" variant="h5" className={classes.heading}>
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        value={name}
                        onChange={handleName}
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Your Name"
                        name="name"
                        autoFocus
                        color="secondary"
                        className={classes.textField}
                        InputProps={{
                            className: classes.input,
                        }}
                        InputLabelProps={{
                            className: classes.inputLabel
                        }}
                    />
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
                            className: classes.inputLabel
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
                            className: classes.inputLabel
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={registerUser}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link
                                variant="body2"
                                onClick={goToLogin}
                                style={{ 
                                    cursor: 'pointer',
                                    color: '#599aba' ,
                                    textDecoration: 'none',
                                }}
                            >
                                {'Already have an account? Login'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
        </MuiThemeProvider>
    );
}
