'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Image from 'next/image'

const BrandSlider = ({ items }) => {
  return (
    <div className=" ">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        autoplay={{  delay:1, disableOnInteraction: false }}
        loop
        speed={5000}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className=" rounded-lg flex justify-center items-center text-8xl ">
              {/* <Image
                width={150}
                height={150}
                src={item.logo}
                alt='brand'
                unoptimized
                className=" rounded-lg"
              /> */}
              {item.logo}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BrandSlider
