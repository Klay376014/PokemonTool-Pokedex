'use client'
import axios from 'axios'
import type { Ability, Pokemon, List } from '@/lib/schema'
import { useEffect, useRef, useCallback } from 'react'
import { useStore, useThemeStore } from '@/store/store'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import { PokemonCard } from '@/components/pokemon-card'
import { PokemonList } from '@/components/pokemon-list'
import { SearchBar } from '@/components/search-bar'



export function Pokedex() {
  const setInitialPokemonList = useStore((state) => state.setInitialPokemonList)
  const selectedPokemon = useStore((state) => state.selectedPokemon)
  const initialFetch = useRef(true)

  const fetchPokemonList = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/dexList')
      const list: List[] = response.data
      const dexList = list.map(item => {
        const [[name, idNumber]] = Object.entries(item).filter(([key]) => key !== 'id')
        return { name, id: Number(idNumber) }
      })
      setInitialPokemonList(dexList)
    } catch (error) {
      console.error('Error fetching Pokémon list:', error)
      return []
    }
  }, [setInitialPokemonList])

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
        useStore.setState((state) => ({
          selectedPokemon: {
            ...state.selectedPokemon,
            stats: pokemonData.baseStats,
            weight: `${pokemonData.weightkg} kg`,
            height: `${pokemonData.heightm} m`,
            type: pokemonData.types,
            abilities
          }
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }, [selectedPokemon.name])

  useEffect(() => {
    if (initialFetch.current) {
      fetchPokemonList()
      initialFetch.current = false
    }
  }, [fetchPokemonList])

  useEffect(() => {
    const abortController = new AbortController()
    fetchPokemon()
    return () => {
      abortController.abort()
    }
  }, [fetchPokemon])


  const darkMode = useThemeStore((state) => state.darkMode)

  return (
    <SidebarProvider>
      <div className={`h-screen flex flex-1 ${darkMode ? 'dark' : ''}`}>
        <Sidebar className="w-64 border-r dark:border-gray-700">
          <SidebarHeader>
            <SearchBar />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <PokemonList />
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto dark:bg-gray-900">
          <div className="p-6 flex-1">
            <PokemonCard />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
