import React from "react"


type Props = {
    children: React.ReactNode
}

function Card({ children }: Props) {
    return (
        <div className="bg-white rounded-lg p-5">
            {children}
        </div>
    )
}

export default Card