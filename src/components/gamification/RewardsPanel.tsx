import React from 'react';
import { useRewards } from '../../features/gamification/hooks/useRewards';

export const RewardsPanel: React.FC = () => {
  const { currency, powerUps, inventory, usePowerUp } = useRewards();

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <h3 className="font-bold">Stars</h3>
          <p className="text-2xl">⭐ {currency.stars}</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <h3 className="font-bold">Gems</h3>
          <p className="text-2xl">💎 {currency.gems}</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">Power-Ups</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {Object.values(powerUps).map(powerUp => (
            <button
              key={powerUp.id}
              onClick={() => usePowerUp(powerUp.id)}
              className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
            >
              <h4>{powerUp.type}</h4>
              <p className="text-sm text-gray-600">Quantity: {powerUp.quantity}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">Inventory</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(inventory).map(([category, items]) => (
            <div key={category} className="p-4 rounded-lg bg-white border border-gray-200">
              <h4 className="capitalize mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <span key={item} className="px-2 py-1 bg-gray-100 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 