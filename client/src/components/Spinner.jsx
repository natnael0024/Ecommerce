'use client'

import Image from "next/image";

const Spinner = () => (
    <div className=" z-50 absolute top-1/2 left-1/2  flex justify-center items-center">
        <div className=" w-16 h-16 border-4 border-r-[#0379e0] border-l-amber-400 border-t-transparent border-b-transparent rounded-full animate-spin">
            
        </div>
        <Image
            src={'/logo-icon.png'}
            width={30}
            height={30}
            unoptimized
            alt=""
            className=" absolute"
            />
    </div>
  )
  
export default Spinner;
  