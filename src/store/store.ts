import { create } from 'zustand'

type singlePokemon = {
  id: number
  name: string
  type: string[]
  height: string
  weight: string
  abilities: { name: string; description: string; abilityType: string }[]
  stats: { [key: string]: number }
  moves: { name: string; level: number; type: string; accuracy: number; power: number }[]
}

type Store = {
  selectedPokemon: singlePokemon
  setSelectedPokemon: (pokemon: singlePokemon) => void
  initialPokemonList: { id: number; name: string }[]
  setInitialPokemonList: (list: { id: number; name: string }[]) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  debouncedTerm: string
  setDebouncedTerm: (term: string) => void
}

type ThemeStore = {
  darkMode: boolean
  setDarkMode: (mode: boolean) => void
}

export const useStore = create<Store>((set) => ({
  selectedPokemon: {
    id: 1,
    name: 'Bulbasaur',
    type: ['Grass', 'Poison'],
    height: '0.7 m',
    weight: '6.9 kg',
    abilities: [
      {
        name: 'Overgrow',
        description: 'Powers up Grass-type moves when the Pokémon\'s HP is low.',
        abilityType: '0'
      },
      {
        name: 'Chlorophyll',
        description: 'Boosts the Pokémon\'s Speed stat in harsh sunlight.',
        abilityType: 'H'
      },
    ],
    stats: {
      hp: 100,
      atk: 100,
      def: 100,
      spa: 100,
      spd: 100,
      spe: 100,
    },
    moves: [
      { name: 'Tackle', level: 1, type: 'Normal', accuracy: 100, power: 40 },
      { name: 'Growl', level: 1, type: 'Normal', accuracy: 100, power: 0 },
      { name: 'Vine Whip', level: 3, type: 'Grass', accuracy: 100, power: 45 },
      { name: 'Growth', level: 6, type: 'Normal', accuracy: 100, power: 0 },
      { name: 'Poison Powder', level: 9, type: 'Poison', accuracy: 75, power: 0 },
      { name: 'Razor Leaf', level: 12, type: 'Grass', accuracy: 95, power: 55 },
      { name: 'Sleep Powder', level: 15, type: 'Grass', accuracy: 75, power: 0 },
      { name: 'Take Down', level: 20, type: 'Normal', accuracy: 85, power: 90 },
      { name: 'Seed Bomb', level: 25, type: 'Grass', accuracy: 100, power: 80 },
      { name: 'Sweet Scent', level: 28, type: 'Normal', accuracy: 100, power: 0 },
      { name: 'Solar Beam', level: 32, type: 'Grass', accuracy: 100, power: 120 },
      { name: 'Synthesis', level: 36, type: 'Grass', accuracy: 100, power: 0 },
      { name: 'Worry Seed', level: 40, type: 'Grass', accuracy: 100, power: 0 },
      { name: 'Double-Edge', level: 44, type: 'Normal', accuracy: 100, power: 120 },
    ],
  },
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  initialPokemonList: [],
  setInitialPokemonList: (list) => set({ initialPokemonList: list }),
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  debouncedTerm: '',
  setDebouncedTerm: (term) => set({ debouncedTerm: term })
}))

export const useThemeStore = create<ThemeStore>((set) => ({
  darkMode: true,
  setDarkMode: (mode) => set({ darkMode: mode })
}))
