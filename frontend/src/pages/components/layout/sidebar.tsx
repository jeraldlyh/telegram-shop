import classNames from "classnames"
import { AiOutlineClose, AiOutlineShoppingCart, AiFillSetting, AiOutlineUser, AiOutlineInbox, AiOutlineSkin } from "react-icons/ai"
import { useRouter } from "next/router"
import Link from "next/link"
import { FiArrowRightCircle, FiLogOut } from "react-icons/fi"
import {
	ProSidebar,
	SidebarHeader,
	Menu,
	MenuItem,
	SubMenu,
	SidebarContent,
	SidebarFooter,
} from "react-pro-sidebar"
import "react-pro-sidebar/dist/css/styles.css"

type Props = {
	collapsed: boolean
}

const Sidebar = ({ collapsed }: Props) => {
	const router = useRouter()

	const background = (path: string) => {
		return classNames({
			"mb-1 items-center justify-center": true,
			"bg-purple shadow-sidebar rounded-lg text-white":
				router.pathname === `/${path}`,
			"text-black hover:text-gray-700": router.pathname !== `/${path}`,
		})
	}
	const text = (path: string) => {
		return classNames({
			"font-semibold": true,
			"text-white": router.pathname === `/${path}`,
			"text-black hover:text-gray-700": router.pathname !== `/${path}`,
		})
	}

	return (
		<div id="sidebar">
			<ProSidebar collapsed={collapsed} collapsedWidth={95} breakPoint="md">
				<SidebarHeader className="flex justify-center items-center p-5 font-extrabold text-black">
					{collapsed ? <FiArrowRightCircle /> : "DevStudios"}
				</SidebarHeader>
				<SidebarContent>
					<Menu iconShape="square">
						<MenuItem
							className={background("orders")}
							icon={<AiOutlineShoppingCart />}
						>
							<Link href="/orders">
								<span className={text("orders")}>Orders</span>
							</Link>
						</MenuItem>
						<MenuItem
							className={background("customers")}
							icon={<AiOutlineUser />}
						>
							<Link href="/customers">
								<span className={text("customers")}>Customers</span>
							</Link>
						</MenuItem>
						<MenuItem
							className={background("categories")}
							icon={<AiOutlineInbox />}
						>
                            <Link href="/categories">
								<span className={text("categories")}>Categories</span>
							</Link>
						</MenuItem>
						<MenuItem
							className={background("products")}
							icon={<AiOutlineSkin />}
						>
							<Link href="/products">
								<span className={text("products")}>Products</span>
							</Link>
						</MenuItem>
                        <MenuItem
							className={background("Settings")}
							icon={<AiFillSetting />}
						>
							<Link href="/settings">
								<span className={text("settings")}>Settings</span>
							</Link>
						</MenuItem>
					</Menu>
				</SidebarContent>
				<SidebarFooter>
					<Menu iconShape="square">
						<MenuItem className={background("Logout")} icon={<FiLogOut />}>
							Logout
						</MenuItem>
					</Menu>
				</SidebarFooter>
			</ProSidebar>
		</div>
	)
}

export default Sidebar
