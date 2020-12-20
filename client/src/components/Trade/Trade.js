import React from "react";
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import axios from "axios";

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

class Trade extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            symbol: '',
            quantity: 0,
            errors: '',
        }
    }
    handleChange = event => ({ target }) => {
        this.setState({
            [event]: target.value
        });
    }

    handleBuy = async (event) => {
        event.preventDefault();
        try {
            if (this.state.symbol.length === 4 && this.state.quantity > 0) {
                let id = sessionStorage.getItem('id');
                let data = await axios.get(`/api/stock/search/${this.state.symbol}`)
                let price = data['data']['Global Quote']['05. price'];
                if (price * this.state.quantity > this.props.balance) {
                    this.setState({
                        error: 'Insufficient Balance.'
                    })
                } else {
                    let buy = {
                        symbol: this.state.symbol.toUpperCase(),
                        price: parseFloat(price).toFixed(2),
                        quantity: this.state.quantity
                    }
                    let balance = {
                        newBalance: parseFloat(this.props.balance).toFixed(2) - (parseFloat(price).toFixed(2) * parseFloat(this.state.quantity).toFixed(2))
                    }

                    let transaction = {
                        type: 'Buy',
                        symbol: this.state.symbol.toUpperCase(),
                        price: parseFloat(price).toFixed(2),
                        quantity: this.state.quantity,
                        transaction: Date.now(),
                        userId: id
                    }
                    await Promise.all([
                        axios.post(`/api/stock/${id}/buy`, buy),
                        axios.put(`/api/user/${id}`, balance),
                        axios.post(`/api/history/${id}`, transaction)
                    ])

                    this.setState({
                        error: 'Success!'
                    })
                }
            } else {
                this.setState({
                    error: 'Missing information!'
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    handleSell = async (event) => {
        event.preventDefault();
        try {
            if (this.state.symbol.length === 4 && this.state.quantity > 0) {
                let symbolQuantiy = 0;
                for (let i = 0; i < Object.keys(this.props.portfolio).length; i++) {
                    let stock = Object.values(this.props.portfolio)[i];
                    if (stock['symbol'] === this.state.symbol.toUpperCase())
                        symbolQuantiy = stock['quantity']
                }
                
                if(this.state.quantity > symbolQuantiy) {
                    console.log(symbolQuantiy);
                    this.setState({
                        error: 'You do not have that many shares!'
                    })
                }
                else{
                    let id = sessionStorage.getItem('id');
                    console.log(id);
                    let data = await axios.get(`/api/stock/search/${this.state.symbol}`)
                    let price = data['data']['Global Quote']['05. price'];
                    let sell = {
                        symbol: this.state.symbol.toUpperCase(),
                        price: parseFloat(price).toFixed(2),
                        quantity: this.state.quantity
                    }
                    let balance = {
                        newBalance: (parseFloat(this.props.balance).toFixed(2) - 0) + ((parseFloat(price).toFixed(2) * parseFloat(this.state.quantity).toFixed(2)) - 0)
                    }
                    let transaction = {
                        type: 'Sell',
                        symbol: this.state.symbol.toUpperCase(),
                        price: parseFloat(price).toFixed(2),
                        quantity: this.state.quantity,
                        transaction: Date.now(),
                        userId: id
                    }
                    await Promise.all([
                        axios.post(`/api/stock/${id}/sell`, sell),
                        axios.put(`/api/user/${id}`, balance),
                        axios.post(`/api/history/${id}`, transaction)
                    ])

                    this.setState({
                        error: 'Success!'
                    })
                }
            } else {
                this.setState({
                    error: 'Missing information!'
                })
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
                    <Typography component="h1" color='primary' variant="h4">
                        Buy/Sell
                </Typography>

                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Ticker"
                                    placeholder='GOOG'
                                    name="symbol"
                                    id='symbol'
                                    onChange={this.handleChange('symbol')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="quantity"
                                    id='quantity'
                                    label="Shares"
                                    onChange={this.handleChange('quantity')}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"

                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleBuy}
                            style={{ margin: 5, width: 175 }}
                        >
                            Buy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleSell}
                            style={{ margin: 5, width: 175 }}
                        >
                            Sell
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                Balance: ${this.props.balance}
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-end">
                            <Grid item >
                                <font size="1">Button not working? Try again in 60 seconds. API limit reached.</font>
                            </Grid>
                        </Grid>

                    </form>
                    {this.state.error === 'Success!' ? (<div style={{ color: 'Green' }}>{this.state.error}</div>) : (<div style={{ color: 'Red' }}>{this.state.error}</div>)}
                </div>
            </Container>
        )
    }
}

const mapState = state => ({
    user: state.user,
});

export default withRouter(connect(
    mapState, null)(withStyles(styles)(Trade)));
