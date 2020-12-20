import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class PortfolioCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
 
    render() {
        let stock = this.props.stock;
        let percentChange = ((this.props.assets[this.props.index]- this.props.open[this.props.index]) / this.props.open[this.props.index]) * 100
        let assetTotal = parseFloat(this.props.assets[this.props.index]).toFixed(2) * parseFloat(stock.quantity).toFixed(2)
        
        return (
            <TableBody>
                <TableRow>
                        <TableCell>{stock.symbol}</TableCell>
                        <TableCell>${parseFloat(assetTotal).toFixed(2)}</TableCell>
                        <TableCell>{stock.quantity}</TableCell>
                        {percentChange > 0 ? (<TableCell style={{color:'Green'}} align="right">{parseFloat(percentChange).toFixed(2)}%</TableCell>) : (<TableCell style={{color:'Red'}} align="right">{parseFloat(percentChange).toFixed(2)}%</TableCell>)}
                    </TableRow>
            </TableBody>
        );
    }
}

export default PortfolioCard