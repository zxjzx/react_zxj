import React, { useState } from 'react';
import { Input } from 'antd';

type PropsType = {
  prefixCls?: string;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  disabled?: boolean;
  type?: string;
  value?: string | ReadonlyArray<string> | number;
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  minLength?: number;
  point?: number;
  onChange?: ( value ) => void;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
}
const InputNumberBox = ( props: PropsType ) => {
  const { value, onChange, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, point = 0, prefix, suffix, className, ...resetProps } = props;

  const [ number, setNumber ] = useState( value || 0 );
  const onNumberChange = ( e ) => {
    let newNumber: string = e.target.value;
    setNumber( newNumber );
    onChange?.( newNumber );
  };

  const onNumberBlur = () => {
    let newNumber: string | number = Number.parseFloat( String( number ) );
    if ( newNumber > min && newNumber < max ) {
      newNumber = newNumber.toFixed( point );
    } else {
      newNumber = ''
    }
    setNumber( newNumber );
    onChange?.( newNumber );
  }

  const onStopProp = ( e ) => {
    e.stopPropagation();
  }

  return (
    <Input
      className={ className }
      type="text"
      prefix={ prefix && <span onMouseUp={ onStopProp }>{ prefix }</span> }
      suffix={ suffix }
      value={ number || value }
      onChange={ onNumberChange }
      onBlur={ onNumberBlur }
      onMouseUp={ onStopProp }
      { ...resetProps }
    />
  );
};

export default InputNumberBox
