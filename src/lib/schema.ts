import { z } from 'zod'

const baseStatsSchema = z.object({
  hp: z.number(),
  atk: z.number(),
  def: z.number(),
  spa: z.number(),
  spd: z.number(),
  spe: z.number(),
})

const abilitiesSchema = z.object({
  '0': z.string(),
  '1': z.string().optional(),
  'H': z.string().optional()
})

const genderRatioSchema = z.object({
  M: z.number(),
  F: z.number(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pokemonSchema = z.object({
  num: z.number(),
  name: z.string(),
  types: z.array(z.string()),
  genderRatio: genderRatioSchema,
  baseStats: baseStatsSchema,
  abilities: abilitiesSchema,
  heightm: z.number(),
  weightkg: z.number(),
  color: z.string(),
  evos: z.array(z.string()).optional(),
  eggGroups: z.array(z.string()),
  tier: z.string(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AbilitySchema = z.object({
  name: z.string(),
  shortDesc: z.string(),
  desc: z.string().optional(),
  damage: z.string().optional(),
  activate: z.string().optional(),
  block: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  boost: z.string().optional(),
  transform: z.string().optional(),
  activateNoTarget: z.string().optional(),
  changeAbility: z.string().optional(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PokemonListSchema = z.object({
  id: z.string(),
}).catchall(z.number())


export type Pokemon = z.infer<typeof pokemonSchema>
export type Ability = z.infer<typeof AbilitySchema>
export type List = z.infer<typeof PokemonListSchema>