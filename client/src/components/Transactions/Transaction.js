import React from "react";
import { withRouter } from "react-router-dom";
import NavBar from '../NavBar/Navbar'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { connect } from 'react-redux';
import TransactionCard from '../TransactionsCard/TransactionCard'
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

class Transaction extends React.Component {
    constructor() {
        super();
        this.state = {
            portfolio: []
        }
    }
    async componentDidMount() {
        if (!sessionStorage.getItem('stockAPI'))
            this.props.history.push('/');
        else {
            const id = sessionStorage.getItem('id');
            let { data } = await axios.get(`/api/history/${id}`)
            this.setState({
                portfolio: data
            })
        }
    }

    render() {
        const { classes } = this.props
        return (
            <div className='transaction-main'>
                <NavBar history={this.props.history} /><br></br>
                <Button href='/' variant="contained" color="primary" style={{marginBottom: 10}}>Home</Button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Paper className={classes.paper}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>Transaction History</Typography>
                        <Table size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transaction Type</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Shares</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell align="right">Transaction Date</TableCell>
                                </TableRow>
                            </TableHead>
                            {this.state.portfolio.reverse().map((item, index) => {
                                return (
                                    <TransactionCard key={index} type={item.type} symbol={item.symbol} price={item.price} quantity={item.quantity} date={item.transactionDate} />
                                )
                            })}

                        </Table>
                    </Paper>

                </div>
            </div>
        )
    }
}

const mapState = state => ({
    user: state.user,
});

export default withRouter(connect(
    mapState, null)(withStyles(styles)(Transaction)))