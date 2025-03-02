import { useStore } from '@/store/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { calculateStatRange } from '@/utils'
import { useMemo } from 'react'
import AbilityPopover from '@/components/ability-popover'
import { TypeBadge } from './type-badge'
import { DefenseTypeTable } from './defense-type-table'
import type { PokemonType } from '@/lib/schema'

const statColors = {
  hp: { fill: 'bg-red-500', unfilled: 'bg-red-200 dark:bg-red-950' },
  atk: { fill: 'bg-orange-500', unfilled: 'bg-orange-200 dark:bg-orange-950' },
  def: { fill: 'bg-yellow-500', unfilled: 'bg-yellow-200 dark:bg-yellow-950' },
  spa: { fill: 'bg-blue-500', unfilled: 'bg-blue-200 dark:bg-blue-950' },
  spd: { fill: 'bg-green-500', unfilled: 'bg-green-200 dark:bg-green-950' },
  spe: { fill: 'bg-purple-500', unfilled: 'bg-purple-200 dark:bg-purple-950' },
}

export function PokemonCard() {
  const selectedPokemon = useStore((state) => state.selectedPokemon)
  const totalBaseStats = useMemo(() => {
    return Object.values(selectedPokemon.stats).reduce((sum, stat) => sum + stat, 0)
  }, [selectedPokemon.stats])

  return (
    <Card className="dark:bg-gray-800 dark:text-white h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center">
            {selectedPokemon.name}
            <span className="ml-2 text-sm text-muted-foreground dark:text-gray-400 flex items-center">
              #{selectedPokemon.id.toString().padStart(3, '0')}
              <div className="flex gap-2 ml-3 font-bold">
                {selectedPokemon.type.map((type) => (
                  <TypeBadge type={type as PokemonType} isTable={false} />
                ))}
              </div>
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:mr-10">
            <div className='flex justify-between items-center mb-6'>
              <img
              src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${selectedPokemon.id.toString().padStart(3, '0')}.png`}
              alt={selectedPokemon.name}
              className="dark:bg-gray-700 mr-3"
              style={{ height: '250px', width: '250px' }}
              />
              <div className='w-2/3'>
              <p className='font-bold text-xl'>Type effective while damaged by</p>
              <DefenseTypeTable type={selectedPokemon.type} />
              </div>
            </div>
            <div className="space-y-6">
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
                      <div className={`w-[60%] h-2.5 rounded-full overflow-hidden ${statColors[stat as keyof typeof statColors].unfilled}`}>
                        <div
                          className={`h-full ${statColors[stat as keyof typeof statColors].fill}`}
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
            <h3 className="font-semibold mb-2 text-xl">Moves</h3>
            <ScrollArea className="h-[calc(100vh-14rem)] pr-4">
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
  )
}