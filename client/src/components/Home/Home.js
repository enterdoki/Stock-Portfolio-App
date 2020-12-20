import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import NavBar from '../NavBar/Navbar'
import Chart from '../Chart/Chart'
import Trade from '../Trade/Trade'
import TextField from '@material-ui/core/TextField';

class Stock extends React.Component {
    constructor() {
        super();
        this.state = {
            stockPrice:0,
            symbol: "",
            stock: [],
            user: [],
            portfolio: [],
            weekly: [],
            tradeClick: false,
            searchClick: false,
            assets:[],
            shares:[],
        }
    }

    async componentDidMount() {
        if (!sessionStorage.getItem('stockAPI'))
            this.props.history.push('/');
        else {
            const id = sessionStorage.getItem('id');
            let { data } = await axios.get(`/api/stock/${id}`)
            this.setState({
                user: data,
                portfolio: data.stocks
            })
            
            let shares = []
            let assets = []
            for(let stock of Object.values(data.stocks)) {
                let {data} = await axios.get(`/api/stock/search/${stock.symbol}`)
                if(data['Global Quote']) {
                    shares.push(stock.quantity);
                    assets.push(data['Global Quote']['05. price']) 
                } 
            }
            this.setState({
                shares,
                assets
            })
        }
        
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            symbol: event.target.value.toUpperCase(),
            searchClick: false
        })
    }

    handleTradeClick = () => {
        this.setState({
            tradeClick: !this.state.tradeClick
        })
    }

    handleSubmit = async () => {
        try {
            let stock = await axios.get(`/api/stock/search/${this.state.symbol}`)
            let bigData = await axios.get(`/api/stock/search/${this.state.symbol}/data`)
            if(bigData && stock) {
                this.setState({
                    stockPrice: stock['data']['Global Quote']['05. price'],
                    weekly: bigData['data'],
                    searchClick: true
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    handleKeyPress = event => {
        if(event.key === 'Enter') {
          this.handleSubmit();
        }
      };

    display = () => (
        Object.keys(this.state.stock['Global Quote']).map((key, i) => {
            return <div key={i}> {key.substr(3)}: {this.state.stock['Global Quote'][key]}</div>
        })
    )

    render() {
        let portfolioTotal = 0;
        const { user } = this.state; 
        if(this.state.shares.length > 0 && this.state.assets.length > 0) {
            for(let i = 0; i < this.state.shares.length; i++) {
                let share = this.state.shares[i];
                let price = this.state.assets[i];
                portfolioTotal = (portfolioTotal - 0) + (parseFloat(share).toFixed(2) * parseFloat(price).toFixed(2)-0)
            }
        }
        let dates = []
        if (this.state.weekly) {
            for (let i = Math.floor(Object.keys(this.state.weekly).length - 1 / 2); i >= 0; i--) {
                let labels = Object.keys(this.state.weekly)[i];
                dates.push(labels);
            }
        }
        let close = []
        if (this.state.weekly) {
            for (let i = Math.floor(Object.keys(this.state.weekly).length - 1 / 2); i >= 0; i--) {
                let labels = Object.values(this.state.weekly)[i]['4. close'];
                close.push(labels);
            }
        }
        let open = []
        if (this.state.weekly) {
            for (let i = Math.floor(Object.keys(this.state.weekly).length - 1 / 2); i >= 0; i--) {
                let labels = Object.values(this.state.weekly)[i]['1. open'];
                open.push(labels);
            }
        }
        let high = []
        if (this.state.weekly) {
            for (let i = Math.floor(Object.keys(this.state.weekly).length - 1 / 2); i >= 0; i--) {
                let labels = Object.values(this.state.weekly)[i]['2. high'];
                high.push(labels);
            }
        }
        let low = []
        if (this.state.weekly) {
            for (let i = Math.floor(Object.keys(this.state.weekly).length - 1 / 2); i >= 0; i--) {
                let labels = Object.values(this.state.weekly)[i]['3. low'];
                low.push(labels);
            }
        }
        return (
            <div className='stock-container'>
                <NavBar history={this.props.history} /><br></br>
                <div className='main-buttons'>
                    <Button style={{ margin: 5 }} href='/' variant="contained" color="primary">Home</Button>
                    <Button style={{ margin: 5 }} href='/portfolio' variant="contained" color="primary">Portfolio</Button>
                    <Button style={{ margin: 5 }} variant="contained" color="primary" onClick={this.handleTradeClick}>Trade</Button>
                    <Button style={{ margin: 5 }} href='/transaction' variant="contained" color="primary">Transactions</Button>
                </div>
                <h2>Welcome, {user.firstname} {user.lastname}</h2>
                <h3>Portfolio: ${parseFloat(portfolioTotal).toFixed(2)} | Balance: ${parseFloat(user.balance).toFixed(2)}</h3>
                <font size="1">Values not showing? Try again in 60 seconds. API limit reached.</font>
                <div className="search-container">
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="search"
                        label="Search"
                        name="search"
                        placeholder='GOOG'
                        autoFocus
                        onChange={this.handleChange}
                        style={{ width: 750 }}
                        onKeyPress = {this.handleKeyPress}
                    />
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                {this.state.searchClick  ? (<div > <Chart price={this.state.stockPrice} symbol={this.state.symbol} dates={dates} close={close} open={open} high={high} low={low} /></div>)
                    : (<div></div>)}
                {this.state.tradeClick ? (<div><Trade portfolio={this.state.portfolio} balance={user.balance}/></div>) : (<div></div>)}
                </div>
            </div>
        )
    }
}

const mapState = state => ({
    user: state.user,
});

export default connect(
    mapState, null)(withRouter(Stock));