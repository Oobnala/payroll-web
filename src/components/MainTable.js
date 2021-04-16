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
import MainRow from "./MainRow"

// Temp import data from external source in JSON format
import data from "../data.json"


class MainTable extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      rowChanges: {},
      rows: [],
      headers: [],
      historyHeaders: [],
    };
  }

  handleSubmit(rowIndex) {
    console.log("performing handle submit");
    console.log(this.state.rowsChanges[rowIndex]);
  }

  handleTextFieldChange(rowIndex, change) {
    console.log("handling text field change");
    this.setState((prevState) => ({
      rowsChanges: {
        ...prevState.rowsChanges,
        [rowIndex]: {
          ...prevState.rowsChanges[rowIndex],
          [change.fieldName]: change.fieldValue,
        },
      },
    }));
  }

  componentDidMount() {
    // Initialize data here, get it from an api req?
    console.log("initializing data");
    console.log(data)
    this.setState({
      headers: data.headers,
      rows: data.rows,
      historyHeaders: data.historyHeaders
    });
  }

  render() {
    const { rows, headers, historyHeaders } = this.state;
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell />
                {headers && headers.map((header) => (
                    <TableCell key={header} align="center">{header}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <MainRow
                key={`${row.firstName}${row.lastName}`}
                row={row}
                headers={headers}
                historyHeaders={historyHeaders}
                index={index}
                handleTextFieldChange={this.handleTextFieldChange}
                handleSubmit={this.handleSubmit}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default MainTable;
