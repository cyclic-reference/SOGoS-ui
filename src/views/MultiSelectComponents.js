import Chip from "@material-ui/core/Chip";
import clsx from "clsx";
import CancelIcon from "@material-ui/icons/Cancel";
import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

export const MultiValue = props => (
  <Chip
    label={props.children}
    className={clsx(props.selectProps.classes.chip, {
      [props.selectProps.classes.chipFocused]: props.isFocused,
    })}
    onDelete={props.removeProps.onClick}
    deleteIcon={<CancelIcon  />}
  />
);
export const NoOptionsMessage = props => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.noOptionsMessage}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);
const inputComponent = ({inputRef, ...props}) =>
  <div ref={inputRef} {...props} />;
export const Control = props => {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: {classes, TextFieldProps},
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
};
export const Option = props => (
  <MenuItem
    ref={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400,
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);
export const Placeholder = props => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);
export const SingleValue = props => (
  <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
    {props.children}
  </Typography>
);
export const ValueContainer = props =>
  <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
export const Menu = props => (
  <Paper square
          style={{zIndex: 69}}
         className={props.selectProps.classes.paper}
         {...props.innerProps}>
    {props.children}
  </Paper>
);
export const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};
