import { NumberFormatCustomProps } from './../../Interface/MainTypes'; 
import NumberFormat from 'react-number-format';


const NumberFormatPrice = (props: NumberFormatCustomProps) => {
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
        decimalScale = {2}
        fixedDecimalScale
        allowNegative = {false}
      />
    );
}

export default NumberFormatPrice;