import Link from "next/link"
import { useState } from "react"
import { FaBars, FaHome, FaBox, FaList, FaUsers, FaCog, FaChartLine, FaTags, FaShippingFast } from "react-icons/fa"
import { IoChevronBackOutline, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5"
import { FaOpencart } from "react-icons/fa6"
import { RiDashboard3Line } from "react-icons/ri"
import { LuPackage, LuShieldCheck } from "react-icons/lu"
import { MdOutlineCategory } from "react-icons/md"
import { IoAnalyticsOutline } from "react-icons/io5"
import { LuUsers } from "react-icons/lu"
import { LuTags } from "react-icons/lu"
import { TbHierarchy2, TbSettings2 } from "react-icons/tb"
import { HiBars3BottomLeft } from "react-icons/hi2"
import { LiaShippingFastSolid } from "react-icons/lia"
import { LuUserCog } from "react-icons/lu";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isUserMgtOpen, setIsUserMgtOpen] = useState(false);

  const toggleMenu = () => {
    setIsUserMgtOpen(!isOpen);
  };
  // const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={`bg-[#ffffff]  dark:bg-primary-200 top-0 text-[#0379e0] dark:text-white ${isCollapsed ? " w-10 sm:w-16 relative" : " absolute md:relative lg:relative w-72"} transition-all duration-500 min-h-screen`}
    >
      <div className={`flex text-sm font-bold md:text-md lg:text-xl  bg-[#0379e0] top-0 flex-col justify-between   ${isCollapsed && 'items-center'}`}>
        <button
          onClick={toggleSidebar}
          className="text-[#ffffff]  px-2 p-4 flex items-center justify-between "
        >
          {!isCollapsed &&
            <Link
              href="/admin"
              className=" text-amber-300 flex items-center gap-1"
            >
              <FaOpencart />
              MyStore
            </Link>}
          {isCollapsed ? <HiBars3BottomLeft className=" text-3xl" /> : <IoChevronBackOutline className=""/>}
        </button>
      </div>

      <div className={` px-2   bottom-0 top-5 flex ${isCollapsed && 'items-center'} flex-col space-y-4 mt-4`}>
        <Link href={'/admin'} className=" flex  px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <RiDashboard3Line className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Dashboard</span>}
        </Link>

        <Link href={'/admin/orders'} className=" flex  px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <LiaShippingFastSolid className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Orders</span>}
        </Link>

        <Link href='/admin/products' className=" flex px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <LuPackage className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Products</span>}
        </Link>

        {/* <Link href='/' className=" flex px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <MdOutlineCategory className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Categories</span>}
        </Link> */}

        {/* <Link href='/' className=" flex px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <IoAnalyticsOutline className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Analytics</span>}
        </Link> */}

        <Link href='/admin/users/customers' className=" flex px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <LuUsers className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Customers</span>}
        </Link>

        <Link href='/admin' className=" flex px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <LuTags className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Promotions</span>}
        </Link>

        <Link href='/admin' className=" flex px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full ">
          <TbSettings2 className=" text-sm md:text-md lg:text-xl" />
          {!isCollapsed && <span className="font-semibold">Settings</span>}
        </Link>

        <div 
          className="flex cursor-pointer px-4 items-center space-x-4 p-2 focus:bg-[#0379e0] focus:text-white hover:bg-[#0379e0] hover:text-white rounded-full"
          onClick={() => setIsUserMgtOpen(!isUserMgtOpen)}
        >
          <LuUserCog className="text-sm md:text-md lg:text-xl" />
          {!isCollapsed && 
            <span className="font-semibold flex items-center gap-2 ">User Management 
              {isUserMgtOpen ? <IoChevronDownOutline/> : <IoChevronUpOutline/>}
            </span>}
        </div>
        {isUserMgtOpen && !isCollapsed && (
          <div className="ml-11 ">
            <Link href="/admin/users" className=" p-2 dark:hover:text-primary hover:underline rounded flex items-center gap-3">
              <LuUsers className=" text-sm md:text-md lg:text-xl " />
              {!isCollapsed && 'Users'}
            </Link>
            <Link href="/admin/users/roles" className=" p-2 dark:hover:text-primary hover:underline rounded flex items-center gap-3">
              <TbHierarchy2 className=" text-sm md:text-md lg:text-xl "/>
              {!isCollapsed && 'Roles'}
              </Link>
            <Link href="/admin/users/permissions" className=" p-2 dark:hover:text-primary hover:underline rounded flex items-center gap-3">
              <LuShieldCheck className=" text-sm md:text-md lg:text-xl "/>
              {!isCollapsed && 'Permissions'}
            </Link>
          </div>
        )}
        </div>
    </div>
  )
}

export default Sidebar
