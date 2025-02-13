'use client'

import Image from "next/image";
import { FaOpencart } from "react-icons/fa6";

const Spinner = ({text}) => (
    <div className=" z-50 absolute top-1/2 left-1/2  flex justify-center items-center">
        <div className=" w-[4.5rem] h-[4.5rem] border-4 border-r-[#0379e0] border-l-amber-400 border-t-transparent border-b-transparent rounded-full animate-spin"> 
        </div>
        <FaOpencart className=" absolute  text-3xl text-amber-300"/>
        {/* <span className="absolute bottom-4 text-xs text-amber-300">MyStore</span> */}
        <span className=" absolute top-20 w-[20rem] text-center font-semibold">{text}</span>
    </div>
  )
  
export default Spinner;
  