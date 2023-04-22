import * as React from 'react';
import { NumberFormatCustomProps } from './../../Interface/MainTypes'; 
import NumberFormat from 'react-number-format';

const NumberFormatCount = (props: NumberFormatCustomProps) =>{
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        allowNegative = {false}
      />
    );
}

export default NumberFormatCount;