import React from "react";
import jwt_decode from "jwt-decode";
import axios from 'axios'
import { withRouter } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { loginUserThunk } from '../../store/utilities/user';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            isAuthenticated: false,
            error: ''
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem('stockAPI'))
            this.props.history.push('/home');
    }

    handleChange = event => ({ target }) => {
        this.setState({
            [event]: target.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let credentials = {
                email: this.state.email.toLowerCase(),
                password: this.state.password
            }
            let res = await axios.post('https://stockportfolio-api.herokuapp.com/auth/login', credentials);
            if (res) {
                const token = res['data']['token']
                const id = res['data']['user'].id
                sessionStorage.setItem("stockAPI", token);
                const decoded = jwt_decode(token);
                sessionStorage.setItem('email', decoded.email);
                sessionStorage.setItem('id', id);
                this.props.history.push('/home')
            }
        } catch (err) {
            this.setState({
                error: 'Invalid credentials.'
            })
            console.log(err);
        }
    }
    render() {
        const { classes } = this.props
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" color='primary' variant="h4">
                        Stock Portfolio
                </Typography>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            placeholder='@gmail.com'
                            autoComplete="email"
                            autoFocus
                            onChange={this.handleChange('email')}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.handleChange('password')}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleSubmit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    {this.state.error.length > 0 ? (<h3 style={{ color: 'Red' }}>{this.state.error}</h3>) : (<div></div>)}
                </div>
                <div>
                </div>
            </Container>
        )
    }
}

const mapState = state => ({
    user: state.user,
});

export default withRouter(connect(
    mapState, { loginUserThunk })(withStyles(styles)(SignIn)))