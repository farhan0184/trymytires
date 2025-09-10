'use client'

const Button = ({child, className, func}) => {
    return (
        <button className={className} onClick={func}>
            {child}
        </button>
    );
};

export default Button;