import classNames from "classnames"
import React from "react"


type Props = {
    text: string,
    inverse: boolean,
    onClick: () => void
}

function Button({ text, inverse, onClick }: Props) {
    const button = () => {
        return classNames({
            "rounded-lg p-1 w-24 text-center cursor-pointer": true,
            "bg-purple text-white": !inverse,
            "border border-gray-400 text-purple": inverse
        })
    }

    return (
        <div className={button()} onClick={onClick}>
            {text}
        </div>
    )
}

export default Button