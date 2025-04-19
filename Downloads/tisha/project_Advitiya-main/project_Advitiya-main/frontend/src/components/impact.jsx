import {
    ArrowPathIcon,
    CloudArrowUpIcon,
    FingerPrintIcon,
    LockClosedIcon,
  } from '@heroicons/react/24/outline'
  
  const features = [
    {
      name: 'Over 1 Million Meals Saved',
      description:
        'Every extra meal saved through our platform is a step towards a hunger-free world. Together, we’ve already rescued thousands — and this is just the beginning.',
      icon: CloudArrowUpIcon,
    },
    {
      name: '10,000+ Lives Touched',
      description:
        'We empower citizens, NGOs, and volunteers to be part of a movement. Food that would be wasted now brings hope to shelters, orphanages, and slums.',
      icon: LockClosedIcon,
    },
    {
      name: '100,000+ kg of Waste Prevented',
      description:
        'Reducing food waste helps the planet too. Our system cuts methane emissions and eases the burden on landfills, one donation at a time.',
      icon: ArrowPathIcon,
    },
    {
      name: 'Data-Driven, Heart-Led',
      description:
        'Our smart AI matches food with NGOs efficiently. But behind the tech is a mission driven by compassion, community, and care.',
      icon: FingerPrintIcon,
    },
  ]
  
  export default function SocialImpact() {
    return (
      <div className="bg-gradient-to-br from-green-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-lg font-semibold text-green-600 uppercase tracking-wide">
              Real Change Starts Here
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Transforming Food Waste into Hope
            </p>
            <p className="mt-6 text-xl text-gray-700">
              This platform is not just about tech — it’s about impact. With every meal saved, we nourish lives, protect the planet, and build a culture of giving.
            </p>
          </div>
  
          <div className="mx-auto mt-20 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature) => (
              <div key={feature.name} className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 flex items-center justify-center rounded-full bg-green-100">
                    <feature.icon className="h-7 w-7 text-green-600" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{feature.name}</h3>
                  <p className="mt-2 text-gray-600 text-base leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  