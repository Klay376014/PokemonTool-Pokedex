import { useStore } from '@/store/store'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

export function PokemonList() {
  const pokemonList = useStore((state) => state.initialPokemonList)
  const selectedPokemon = useStore((state) => state.selectedPokemon)
  const setSelectedPokemon = useStore((state) => state.setSelectedPokemon)
  const debouncedTerm = useStore((state) => state.debouncedTerm)
  const switchPokemon = (id: number, name: string) => {
    setSelectedPokemon({
      ...selectedPokemon,
      id,
      name
    })
  }
  
  const filteredPokemonList = useMemo(() => {
    return pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(debouncedTerm.toLowerCase())
    )
  }, [debouncedTerm, pokemonList])
  
  return (
    <SidebarMenu>
      {filteredPokemonList.map((pokemon) => (
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
  )
}