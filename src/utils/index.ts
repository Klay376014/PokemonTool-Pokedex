import type { PokemonType } from '@/lib/schema'

type TypeEffectiveness = {
  [key: string]: number;
};

type EffectivenessResult = {
  '4x': PokemonType[] | ['None'];
  '2x': PokemonType[] | ['None'];
  '1x': PokemonType[] | ['None'];
  '1/2x': PokemonType[] | ['None'];
  '1/4x': PokemonType[] | ['None'];
  '0': PokemonType[] | ['None'];
};

const typeChart: Record<string, TypeEffectiveness> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Ice: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Grass: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5, Fighting: 2, Bug: 2 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Grass: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5, Psychic: 2, Dark: 2 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Dark: 0.5, Ghost: 2 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Dark: 0.5, Fairy: 0.5, Psychic: 2, Ghost: 2 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Fairy: 2, Steel: 0.5 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
}

const defensiveTypeChart: Record<string, TypeEffectiveness> = {}

for (const [attackingType, defenses] of Object.entries(typeChart)) {
  for (const [defendingType, effectiveness] of Object.entries(defenses)) {
    if (!defensiveTypeChart[defendingType]) {
      defensiveTypeChart[defendingType] = {}
    }
    defensiveTypeChart[defendingType][attackingType] = effectiveness
  }
}

/**
 * 
 * @public Type effectiveness calculation
 */
export function calculateEffectiveness(types: PokemonType[]): EffectivenessResult {
  
  const effectiveness: Record<string, number> = {}
  const allTypes = Object.keys(defensiveTypeChart)

  for (const type of types) {
    for (const [attackType, multiplier] of Object.entries(defensiveTypeChart[type] || {})) {
      effectiveness[attackType] = (effectiveness[attackType] || 1) * multiplier
    }
  }

  for (const type of allTypes) {
    if (!(type in effectiveness)) {
      effectiveness[type] = 1
    }
  }

  const result: EffectivenessResult = {
    '4x': ['None'],
    '2x': ['None'],
    '1x': ['None'],
    '1/2x': ['None'],
    '1/4x': ['None'],
    '0': ['None'],
  }

  const categories: Record<number, PokemonType[]> = { 4: [], 2: [], 1: [], 0.5: [], 0.25: [], 0: [] }

  for (const [type, multiplier] of Object.entries(effectiveness)) {
    categories[multiplier]?.push(type as PokemonType)
  }

  for (const [key, value] of Object.entries(categories)) {
    const label = key === '4' ? '4x' : key === '2' ? '2x' : key === '1' ? '1x' : key === '0.5' ? '1/2x' : key === '0.25' ? '1/4x' : '0'
    result[label] = value.length ? value : ['None']
  }

  return result
}

/**
 * 
 * @public Stat range calculation
 */
export const calculateStatRange = (baseStat: number, isHP = false, isLevel100 = false): [number, number] => {
  const level = isLevel100 ? 100 : 50
  const natureModifiers = [0.9, 1.1]
  
  if (isHP) {
    if (baseStat === 1) { // 特殊處理 Shedinja
      return [1, 1]
    }
    const minHP = Math.floor(((2 * baseStat + 0 + Math.floor(0 / 4)) * level) / 100) + level + 10
    const maxHP = Math.floor(((2 * baseStat + 31 + Math.floor(255 / 4)) * level) / 100) + level + 10
    return [minHP, maxHP]
  }
  
  const minStat = Math.floor((((2 * baseStat + 0 + Math.floor(0 / 4)) * level) / 100) + 5) * natureModifiers[0]
  const maxStat = Math.floor((((2 * baseStat + 31 + Math.floor(255 / 4)) * level) / 100) + 5) * natureModifiers[1]
  
  return [Math.floor(minStat), Math.floor(maxStat)]
}
