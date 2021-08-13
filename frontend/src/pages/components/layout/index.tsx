import React, { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"

type Props = {
    children?: React.ReactNode
}

function Layout({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex w-full h-screen">
            <Sidebar collapsed={collapsed} />
            <div className="flex flex-col w-full h-full p-8 bg-white-light space-y-3">
                <Header setCollapsed={() => setCollapsed(!collapsed)} />
                {children}
            </div>
        </div>
    )
}

export default Layout