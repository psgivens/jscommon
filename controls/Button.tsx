import * as React from 'react';

type ButtonProps = {} & {
    text: string,
    onClick: (event:React.MouseEvent<HTMLButtonElement>) => void
}

const Button: React.SFC<ButtonProps> = ( { text, onClick }: ButtonProps ) => {
    return <button type="button" className="btn btn-primary" onClick={onClick} >{ text }</button>;
}

export default Button
