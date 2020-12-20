import React from "react";
import {withRouter } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { registerUserThunk } from '../../store/utilities/user';
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            signedUp: false,
            error:''
        }
    }

    componentDidMount() {
        if (!sessionStorage.getItem('stockAPI'))
            this.props.history.push('/signup');
        else
            this.props.history.push('/home')
    }

    handleChange = event => ({ target }) => {
        this.setState({
            [event]: target.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(this.state.firstname.length === 0 || this.state.lastname.length === 0 || this.state.password.length === 0 || this.state.email.length === 0 || !re.test(this.state.email)) {
                this.setState({
                    error:'Missing proper credentials.'
                })
            } else {
                let newUser = {
                    firstname: this.state.firstname,
                    lastname: this.state.lastname,
                    email: this.state.email,
                    password: this.state.password
                }
                this.props.registerUserThunk(newUser, this.props.history);
            }
        } catch (err) {
            console.log(err);
        }
    }
    render() {
        const { classes } = this.props
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                <Typography component="h1" color = 'primary' variant="h4">
                        Stock Portfolio
                </Typography>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={this.handleChange('firstname')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    onChange={this.handleChange('lastname')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    placeholder='@gmail.com'
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.handleChange('email')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleChange('password')}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleSubmit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <h3 style={{color:'Red'}}>{this.state.error}</h3>
                </div>
            </Container>
        )
    }
}

const mapState = state => ({
    user: state.user,
});

export default withRouter(connect(
    mapState, { registerUserThunk })(withStyles(styles)(SignUp)));
