// HowItWorks.jsx
import React from 'react'
import {
  PlusCircleIcon,
  SparklesIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'

const steps = [
  {
    title: 'List extra food',
    icon: <PlusCircleIcon className="w-12 h-12 text-green-500" />,
    bg: 'bg-green-50',
  },
  {
    title: 'AI matches with NGO',
    icon: <SparklesIcon className="w-12 h-12 text-purple-500" />,
    bg: 'bg-purple-50',
  },
  {
    title: 'NGO collects & distributes',
    icon: <TruckIcon className="w-12 h-12 text-blue-500" />,
    bg: 'bg-blue-50',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 px-6 bg-white">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
        How It Works
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center p-8 rounded-2xl shadow-lg transition transform hover:-translate-y-2 hover:shadow-2xl ${step.bg}`}
          >
            <div className="p-4 rounded-full bg-white mb-4 inline-block">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">
              {step.title === 'List extra food'
                ? 'Quickly post your surplus in seconds.'
                : step.title === 'AI matches with NGO'
                ? 'Smart matching based on need & location.'
                : 'Efficient pickup & delivery by trusted partners.'}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
