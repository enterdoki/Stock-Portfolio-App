import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

export default function TransactionCard(props) {
  const { type, symbol, price, quantity, date } = props;
  const total = parseFloat(price).toFixed(2) * parseFloat(quantity).toFixed(2);
  const dateTime = moment(date).format('llll')
  return (
    <TableBody>
      <TableRow>
        {type === 'Buy' ? (<TableCell style={{color:'Green'}}>Purchased</TableCell>) : <TableCell style={{color: 'Red'}}>Sold</TableCell>}
        <TableCell>{symbol}</TableCell>
        <TableCell>${price}</TableCell>
        <TableCell>{quantity}</TableCell>
        <TableCell>${total}</TableCell>
        <TableCell align="right">{dateTime}</TableCell>
      </TableRow>
    </TableBody>
  );
}