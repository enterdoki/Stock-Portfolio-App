import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import NavBar from '../NavBar/Navbar'
import Trade from '../Trade/Trade'
import PortfolioCard from '../PortfolioCard/PortfolioCard'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const styles = theme => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
});

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            portfolio: [],
            assets:[],
            shares:[],
            open:[]
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
            let open = []
            for(let stock of Object.values(data.stocks)) {
                let {data} = await axios.get(`/api/stock/search/${stock.symbol}`)
                if(data['Global Quote']) {
                    shares.push(stock.quantity);
                    assets.push(data['Global Quote']['05. price']) 
                    open.push(data['Global Quote']['02. open'])
                } 
            }
            this.setState({
                shares,
                assets,
                open
            })
        }
    }

    render() {
        const { user } = this.state;
        const { classes } = this.props
        
        let portfolioTotal = 0;
        if(this.state.shares.length > 0 && this.state.assets.length > 0) {
            for(let i = 0; i < this.state.shares.length; i++) {
                let share = this.state.shares[i];
                let price = this.state.assets[i];
                portfolioTotal = (portfolioTotal - 0) + (parseFloat(share).toFixed(2) * parseFloat(price).toFixed(2)-0)
            }
        }
        return (
            <div className='portfolio-main'>
                <NavBar history={this.props.history} /><br></br>
                <Button href='/' variant="contained" color="primary">Home</Button>
                <h2>Hi, {user.firstname} {user.lastname}</h2>
                <h3>Portfolio: ${parseFloat(portfolioTotal).toFixed(2)} | Balance: ${parseFloat(user.balance).toFixed(2)}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Paper className={classes.paper}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Portfolio Dashboard</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Owned</TableCell>
                                    <TableCell>Shares</TableCell>
                                    <TableCell align="right">Change</TableCell>
                                </TableRow>
                            </TableHead>
                            {this.state.portfolio.map((item,key) =>{
                                return(<PortfolioCard key={key} index = {key} stock={item} assets={this.state.assets} open={this.state.open}/>)
                            })}
                            
                        </Table>
                        <font size="1">Values not showing? Try again in 60 seconds. API limit reached.</font>
                    </Paper>
                    
                    <div><Trade portfolio={this.state.portfolio} balance={user.balance} /></div>
                </div>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(Portfolio));
