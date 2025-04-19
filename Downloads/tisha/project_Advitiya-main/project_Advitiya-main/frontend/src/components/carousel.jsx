'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const slides = [
  {
    image: '/images/ngo1.jpg',
    title: 'Empowering Communities',
    description: 'Helping underprivileged people lead a better life.',
  },
  {
    image: 'https://i.pinimg.com/736x/00/ed/95/00ed9559581782185c21e055f80b2526.jpg',
    title: 'Support & Care',
    description: 'Bringing resources and love to those in need.',
  },
  {
    image: 'https://i.pinimg.com/736x/fe/d3/d2/fed3d2bd1f6b99aa2af1c0259da4971e.jpg',
    title: 'Education for All',
    description: 'We aim to educate every child.',
  },
]

export default function NgosCarousel() {
  const [current, setCurrent] = useState(0)

  const prevSlide = () => {
    setCurrent((current - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setCurrent((current + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-[500px] mt-10 overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 p-6 text-white bg-black/40 w-full sm:w-auto sm:rounded-tr-xl sm:rounded-br-xl">
              <h2 className="text-2xl font-bold">{slide.title}</h2>
              <p className="text-sm mt-1">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      </div>
    </div>
  )
}
