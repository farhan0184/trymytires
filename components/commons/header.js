import React from 'react'

export default function Header({title, subTitle}) {
    return (
        <div className="text-center space-y-2 mb-10">
            <h1 className="secondaryText font-bold text-text italic uppercase">{title}</h1>
            <p className="subtitleText">{subTitle}</p>
        </div>
    )
}
