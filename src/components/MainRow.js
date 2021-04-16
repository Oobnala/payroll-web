
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TableInputField from "./TableInputField";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


// Temp import data from external source in JSON format
import data from "../data.json"

const camelCase = require('camelcase')


const useRowStyles = makeStyles({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
    },
  });


//   <TableInputField
//     row={row}
//     fieldName="name"
//     onCellValueChange={this.handleTextFieldChange.bind(this,index)}
//   />
//   <TableInputField
//     row={row}
//     fieldName="calories"
//     onCellValueChange={this.handleTextFieldChange.bind(this,index)}
//   />
//   <TableInputField
//     row={row}
//     fieldName="fat"
//     onCellValueChange={this.handleTextFieldChange.bind(this,index)}
//   />
//   <TableInputField
//     row={row}
//     fieldName="carbs"
//     onCellValueChange={this.handleTextFieldChange.bind(this,index)}
//   />
//   <TableInputField
//     row={row}
//     fieldName="protein"
//     onCellValueChange={this.handleTextFieldChange.bind(this,index)}
//   />
// <TableCell component="th" scope="row">
//     {/* <Button
//       onClick={this.handleSave.bind(this,index)}
//       variant="outlined"
//     >
//       Save
//     </Button> */}
//   </TableCell>


  
export default function Row(props) {
    const { row, headers, historyHeaders, index, handleSubmit, handleTextFieldChange } = props
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    console.log('Test', handleTextFieldChange)
  
    return (
      <React.Fragment>
        {/* Main Row */}
        <TableRow className={classes.root}>

            {/* Drop Down Button */}
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

            {/* Row Data */}
            {headers && headers.map((header, index) => (
                  <TableInputField
                  row={row}
                  fieldName="SomeDefault"
                />                
    

            ))}
        </TableRow>
  
        {/* Dropdown Row */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={2}>
                <Typography variant="h6" gutterBottom component="div">
                  Pay History
                </Typography>
  
                <Table size="small">
                  <TableHead>
                    {/* History Headers */}
                    <TableRow>
                        {historyHeaders && historyHeaders.map((header, index) => (
                        <TableCell key={index} align="center">{header}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
  
                  <TableBody>
                        {/* History Data */}
                        {row.history.map((historyRow) => (
                            // Row of History Data
                            <TableRow key={historyRow.period}>
                                {historyHeaders && historyHeaders.map((header, index) => (
                                    <TableCell key={index} align="center">{historyRow[ camelCase(header) ]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                  </TableBody>

                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  