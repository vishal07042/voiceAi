// FoodWasteImpact.jsx
import React from 'react'
import {
  ExclamationTriangleIcon,
  GlobeAltIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/solid'

const facts = [
  {
    icon: <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />,
    title: '1 Meal Wasted = 1 Life Ignored',
    description:
      'While millions sleep hungry, over 1/3rd of all food produced is wasted globally. That’s nearly **1.3 billion tons every year**.',
    bg: 'bg-red-100',
  },
  {
    icon: <GlobeAltIcon className="h-12 w-12 text-blue-600" />,
    title: 'Food Waste = Climate Damage',
    description:
      'Rotting food generates methane – a greenhouse gas 25x more potent than CO₂. Reducing food waste = fighting climate change.',
    bg: 'bg-blue-100',
  },
  {
    icon: <HandRaisedIcon className="h-12 w-12 text-green-600" />,
    title: 'You Can Be the Change',
    description:
      'By donating extra food, practicing mindful consumption, and raising awareness, **we can cut food waste in half by 2030**.',
    bg: 'bg-green-100',
  },
]

export default function FoodWasteImpact() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
          The negative impacts of Food Waste
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Behind every wasted meal is a story of hunger, climate damage, and lost opportunity.
          Let’s change that — together.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {facts.map((fact, i) => (
          <div
            key={i}
            className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 ${fact.bg}`}
          >
            <div className="flex justify-center mb-5">
              <div className="bg-white p-4 rounded-full shadow-md">{fact.icon}</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {fact.title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {fact.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
