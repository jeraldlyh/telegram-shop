import React from "react"
import classNames from "classnames"


type Props = {
    children: React.ReactNode,
    maxHeight?: boolean,
}

function Card({ children, maxHeight }: Props) {
    const style = classNames({
        "bg-white rounded lg p-5 max-h-full": true,
        "h-full": maxHeight,
    })

    return (
        <div className={style}>
            {children}
        </div>
    )
}

export default Card