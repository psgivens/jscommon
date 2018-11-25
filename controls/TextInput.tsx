import * as React from 'react';

type AttributeProps = {} & {
    name: string
    value: string
    onChange: (value: React.SyntheticEvent<HTMLInputElement>) => void
    placeholder: string
    inputType: string
    label:string
    size?:number
}

const TextInput:React.SFC<AttributeProps> = ({
    inputType,
    label,
    name,
    onChange,
    placeholder,
    value,
    size
}:AttributeProps) => {
    size = size ? size! : 60
    const onChanged = (event: React.SyntheticEvent<HTMLInputElement>):void => {
        event.preventDefault()
        onChange(event)
    }
    const input = 
        <div><input 
            name={name}
            className="form-control"
            placeholder={placeholder}
            value={value}
            onChange={onChanged}
            type={inputType ? inputType : "text"}
            size={size} /></div>;
    return label 
        ? <div className="form-group">
            <label htmlFor={name}>{label}</label>
            {input}
          </div> 
        : input;


}

export default TextInput 