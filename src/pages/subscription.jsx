import React, { useState } from 'react';
import './filmstrip.css';

const plans = [
  {
    id: 'basic',
    name: 'Basic Membership',
    price: 'Free',
    benefits: ['Watch with ads.', 'Lower Quality'],
  },
  {
    id: 'premium',
    name: 'Premium Membership',
    price: '₹79',
    benefits: ['Watch without ads.', 'High Quality'],
  },
  {
    id: 'referrals',
    name: 'Referrals',
    price: '10 Referrals',
    benefits: ['Watch without ads for 2 hours (10 referrals)'],
  },
];

const features = [
  'Watch without ads',
  'High video quality',
  'Temporary ad-free viewing',
  'Referral-based access',
];

const featureMatrix = {
  basic: [false, false, false, false],
  premium: [true, true, false, false],
  referrals: [true, false, true, true],
};

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  return (
    <div
      className="relative min-h-screen bg-black text-white font-sans flex flex-col items-center pt-24"
      style={{
        backgroundImage: "url('/img/background rectangle.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-green-800/70 backdrop-blur-sm z-0" />

      {/* Main content */}
      <div className="relative z-10 w-full p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">Unlimited. Entertainment. Fun.</h1>
        <p className="text-lg text-gray-300 text-center max-w-xl mb-12">
          Choose a membership to access content with varying features. Instant streaming, no commitment.
        </p>

        {/* Plan Cards */}
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-3xl p-8 w-full lg:w-1/3 border-2 shadow-xl transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id
                  ? 'bg-green-800 border-yellow-500 scale-105'
                  : 'bg-gray-900 border-transparent hover:border-green-600'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div>
                <p className="text-sm text-gray-400 mb-1">Plan</p>
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-400 mr-2">✔</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {plan.id === 'premium' && (
                <div className="mt-6">
                  <span className="bg-yellow-600 text-black px-3 py-1 rounded-full text-xs font-semibold">
                    Best Deal
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex gap-4 flex-wrap justify-center">
          <button className="px-6 py-3 border border-white rounded-full text-sm hover:bg-white hover:text-black transition-all">
            Need a Custom Plan
          </button>
          <button className="px-6 py-3 bg-green-600 rounded-full text-sm font-semibold hover:bg-green-700 transition-all">
            Continue With {plans.find((p) => p.id === selectedPlan).name}
          </button>
        </div>

        {/* Comparison Table */}
        <div className="mt-20 w-full max-w-6xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-gray-400 w-1/3">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="p-4 text-center font-semibold text-white">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    <td className="p-4 text-gray-300">{feature}</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="p-4 text-center">
                        {featureMatrix[plan.id][i] ? (
                          <span className="text-green-400">✔</span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
