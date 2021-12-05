import React from "react"
import { FaAlignJustify } from "react-icons/fa"


type Props = {
    setCollapsed: () => void
}

function Header({ setCollapsed }: Props) {
    return (
        <div className="sticky top-0 flex w-full h-16 bg-white rounded-lg p-5 items-center justify-between mb-3">
            <div className="cursor-pointer" onClick={setCollapsed}>
                <FaAlignJustify />
            </div>
            <span>profile defailts here</span>
        </div>
    )
}

export default Header