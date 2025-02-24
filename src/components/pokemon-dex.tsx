'use client'
import axios from 'axios'
import type { Ability, Pokemon, List } from '@/lib/schema'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Moon, Sun } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import AbilityPopover from '@/components/ability-popover'
import { calculateStatRange } from '@/utils'

type Stat = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe'

const statColors = {
  hp: { fill: 'bg-red-500', unfilled: 'bg-red-200 dark:bg-red-950' },
  atk: { fill: 'bg-orange-500', unfilled: 'bg-orange-200 dark:bg-orange-950' },
  def: { fill: 'bg-yellow-500', unfilled: 'bg-yellow-200 dark:bg-yellow-950' },
  spa: { fill: 'bg-blue-500', unfilled: 'bg-blue-200 dark:bg-blue-950' },
  spd: { fill: 'bg-green-500', unfilled: 'bg-green-200 dark:bg-green-950' },
  spe: { fill: 'bg-purple-500', unfilled: 'bg-purple-200 dark:bg-purple-950' },
}

export function Pokedex() {
  const [selectedPokemon, setSelectedPokemon] = useState({
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
  })
  const [darkMode, setDarkMode] = useState(true)
  const totalBaseStats = Object.values(selectedPokemon.stats).reduce((sum, stat) => sum + stat, 0)
  const initialFetch = useRef(true)

  const switchPokemon = (id: number, name: string) => {
    setSelectedPokemon({
      ...selectedPokemon,
      id,
      name
    })
  }

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/dexList')
      const list: List[] = response.data
      const dexList = list.map(item => {
        const [[name, idNumber]] = Object.entries(item).filter(([key]) => key !== 'id')
        return { name, id: Number(idNumber) }
      })
      setPokemonList(dexList)
    } catch (error) {
      console.error('Error fetching Pokémon list:', error)
      return []
    }
  }
  
  const [pokemonList, setPokemonList] = useState<{ id: number; name: string }[]>([])
  
  useEffect(() => {
    if (initialFetch.current) {
      fetchPokemonList()
    }
  }, [])

  const fetchPokemon = useCallback(async () => {
    try {
      const pokemonData: Pokemon = (await axios.get(`http://localhost:3001/pokemonList?name=${selectedPokemon.name}&_limit=1`)).data[0]
      if (pokemonData) {
        const abilities = await Promise.all(Object.entries(pokemonData.abilities).map(async ([abilityType, abilityName]) => {
          const abilityData: Ability = (await axios.get(`http://localhost:3001/ability?name=${abilityName}&_limit=1`)).data[0]
          return {
            name: abilityName,
            description: abilityData.shortDesc,
            abilityType
          }
        }))
        setSelectedPokemon(prevPokemon => ({
          ...prevPokemon,  // 使用 prevPokemon，避免 selectedPokemon 成為依賴
          stats: pokemonData.baseStats,
          weight: `${pokemonData.weightkg} kg`,
          height: `${pokemonData.heightm} m`,
          type: pokemonData.types,
          abilities
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }, [selectedPokemon.name])

  useEffect(() => {
    if (initialFetch.current) {
      fetchPokemon()
      initialFetch.current = false
    }
  }, [fetchPokemon])

  useEffect(() => {
    fetchPokemon()
  }, [fetchPokemon])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <SidebarProvider>
      <div className={`h-screen flex flex-1 ${darkMode ? 'dark' : ''}`}>
        <Sidebar className="w-64 border-r dark:border-gray-700">
          <SidebarHeader>
            <div className="p-4 flex justify-between items-center">
              <Label htmlFor="search" className="sr-only">
                Search Pokémon
              </Label>
              <div className="relative flex-grow mr-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Search Pokémon" className="pl-8" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="ml-2">
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {pokemonList.map((pokemon) => (
                <SidebarMenuItem key={pokemon.name}>
                  <SidebarMenuButton asChild isActive={pokemon.name === selectedPokemon.name} onClick={() => switchPokemon(pokemon.id, pokemon.name)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <span className="mr-2 text-sm font-medium">#{pokemon.id.toString().padStart(3, '0')}</span>
                      {pokemon.name}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto dark:bg-gray-900">
          <div className="p-6 flex-1">
            <Card className="dark:bg-gray-800 dark:text-white h-full">
              <CardHeader>
                 <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    {selectedPokemon.name}
                    <span className="ml-2 text-sm text-muted-foreground dark:text-gray-400 flex items-center">
                      #{selectedPokemon.id.toString().padStart(3, '0')}
                      <div className="flex gap-2 ml-3 font-bold">
                        {selectedPokemon.type.map((type) => (
                          <Badge key={type} className="dark:bg-gray-700 dark:hover:bg-gray-400 dark:hover:text-white rounded-3xl">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:mr-10">
                    <img
                      src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${selectedPokemon.id.toString().padStart(3, '0')}.png`}
                      alt={selectedPokemon.name}
                      height='350'
                      width='350'
                      className="mb-5 mt-3 dark:bg-gray-700 mx-auto"
                    />
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Info</h3>
                          <div className="flex">
                            <p className="mr-4">Height: {selectedPokemon.height}</p>
                            <p>Weight: {selectedPokemon.weight}</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Abilities</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedPokemon.abilities.map((ability) => (
                              <AbilityPopover key={ability.name} ability={ability} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-semibold mb-3 w-4/5">Stats</h3>
                          <div className="flex justify-between w-1/5">
                            <p className='text-sm mt-2 ml-3'>lv. 50</p>
                            <p className='text-sm mt-2 mr-1'>lv. 100</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(selectedPokemon.stats).map(([stat, value]) => (
                            <div key={stat} className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize w-16">
                                {stat.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-sm font-bold w-8 text-center">{value}</span>
                              <div className={`w-[60%] h-2.5 rounded-full overflow-hidden ${statColors[stat as Stat].unfilled}`}>
                                <div
                                  className={`h-full ${statColors[stat as Stat].fill}`}
                                  style={{ width: `${(value / 200) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm ml-2 text-muted-foreground w-20 text-center">
                                {calculateStatRange(value, stat === 'hp')[0]}-{calculateStatRange(value, stat === 'hp')[1]}
                              </span>
                              <span className="text-sm ml-4 text-muted-foreground w-20 text-center">
                                {calculateStatRange(value, stat === 'hp', true)[0]}-{calculateStatRange(value, stat === 'hp', true)[1]}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm font-bold">Total:<span className="ml-9">{totalBaseStats}</span></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Moves</h3>
                    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
                      <div className="grid gap-2">
                        {selectedPokemon.moves.map((move) => (
                          <div key={move.name} className="bg-muted p-2 rounded-md dark:bg-gray-700">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{move.name}</span>
                              <Badge variant="secondary" className="dark:bg-gray-600">
                                Lv. {move.level}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                              <span className="mr-2">Type: {move.type}</span>
                              <span className="mr-2">Acc: {move.accuracy}%</span>
                              <span>Power: {move.power || 'N/A'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
