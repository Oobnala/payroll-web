import TableCell from '@material-ui/core/TableCell';
import TextField from "@material-ui/core/TextField";

// export default function TableInputField ({ value, onChange }) {
//     const textFieldChange = e => {
//       onChange({
//         fieldValue: e.target.value,
//         // fieldName: fieldName
//       });
//     };
  
//     return (
//       <TableCell>
//         <TextField
//         //   onChange={textFieldChange}
//         //   id={fieldName}
//           label={value}
//           margin="normal"
//         />
//       </TableCell>
//     );
//   };

export default function TableInputField ({ row, fieldName, onCellValueChange }) {
    const handleTextFieldChange = e => {
      onCellValueChange({
        fieldValue: e.target.value,
        fieldName: fieldName
      });
    };
  
    return (
      <TableCell>
        <TextField
          onChange={handleTextFieldChange}
          id={fieldName}
          defaultValue={row[fieldName]}
          margin="normal"
        />
      </TableCell>
    );
  };