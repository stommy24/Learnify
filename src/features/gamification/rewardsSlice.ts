import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Currency {
  stars: number;
  gems: number;
}

export interface PowerUp {
  id: string;
  type: 'hint_boost' | 'xp_multiplier' | 'time_extension';
  quantity: number;
}

interface RewardsState {
  currency: Currency;
  powerUps: Record<string, PowerUp>;
  inventory: {
    avatars: string[];
    badges: string[];
    themes: string[];
  };
}

const initialState: RewardsState = {
  currency: {
    stars: 0,
    gems: 0
  },
  powerUps: {},
  inventory: {
    avatars: ['default'],
    badges: [],
    themes: ['default']
  }
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    addCurrency: (state, action: PayloadAction<Partial<Currency>>) => {
      if (action.payload.stars) state.currency.stars += action.payload.stars;
      if (action.payload.gems) state.currency.gems += action.payload.gems;
    },
    addPowerUp: (state, action: PayloadAction<PowerUp>) => {
      const { id } = action.payload;
      if (state.powerUps[id]) {
        state.powerUps[id].quantity += action.payload.quantity;
      } else {
        state.powerUps[id] = action.payload;
      }
    },
    usePowerUp: (state, action: PayloadAction<string>) => {
      const powerUp = state.powerUps[action.payload];
      if (powerUp && powerUp.quantity > 0) {
        powerUp.quantity -= 1;
        if (powerUp.quantity === 0) {
          delete state.powerUps[action.payload];
        }
      }
    },
    addInventoryItem: (state, action: PayloadAction<{
      type: 'avatars' | 'badges' | 'themes';
      itemId: string;
    }>) => {
      const { type, itemId } = action.payload;
      if (!state.inventory[type].includes(itemId)) {
        state.inventory[type].push(itemId);
      }
    }
  }
});

export const { 
  addCurrency, 
  addPowerUp, 
  usePowerUp, 
  addInventoryItem 
} = rewardsSlice.actions;
export default rewardsSlice.reducer; 