import React, { useState } from 'react';
import { useTheme } from './useTheme';
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
  const { theme } = useTheme();

  return (
    <div
      className={`relative min-h-screen font-sans flex flex-col items-center pt-24 ${theme.background} ${theme.text}`}
      style={{
        backgroundImage: "url('/img/background rectangle.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${theme.background}/10 backdrop-blur-sm z-0`} />

      {/* Main content */}
      <div className="relative z-10 w-full p-8 flex flex-col items-center">
        <p className={`text-4xl font-bold mb-4 text-center ${theme.text}`}>
          Unlimited. Entertainment. Fun.
        </p>
        <p className={`text-lg text-center max-w-xl mb-12 ${theme.text}`}>
          Choose a membership to access content with varying features. Instant streaming, no commitment.
        </p>

        {/* Plan Cards */}
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-3xl p-8 w-full lg:w-1/3 border-2 shadow-xl transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id
                  ? `${theme.accent} border-yellow-500 scale-105`
                  : `${theme.card} border-transparent hover:border-green-600`
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div>
                <p className={`text-sm mb-1 ${theme.text}`}>Plan</p>
                <p className={`text-2xl font-semibold mb-2 ${theme.text}`}>{plan.name}</p>
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
          <button
            className={`px-6 py-3 border rounded-full text-sm transition-all ${theme.text} border-white hover:bg-white hover:text-black`}
          >
            Need a Custom Plan
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${theme.button}`}
          >
            Continue With {plans.find((p) => p.id === selectedPlan).name}
          </button>
        </div>

        {/* Comparison Table */}
        <div className="mt-20 w-full max-w-6xl">
          <p className={`text-2xl font-semibold mb-6 text-center ${theme.text}`}>
            Compare Plans
          </p>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left border-collapse">
              <thead>
                <tr>
                  <th className={`p-4 ${theme.text} w-1/3`}>Features</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`p-4 text-center font-semibold ${theme.text}`}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    <td className={`p-4 ${theme.text}`}>{feature}</td>
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
