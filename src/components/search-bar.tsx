import { useStore, useThemeStore } from '@/store/store'
import { Search, Moon, Sun } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export function SearchBar() {
  const searchTerm = useStore((state) => state.searchTerm)
  const setSearchTerm = useStore((state) => state.setSearchTerm)
  const setDebouncedTerm = useStore((state) => state.setDebouncedTerm)
  const darkMode = useThemeStore((state) => state.darkMode)
  const setDarkMode = useThemeStore((state) => state.setDarkMode)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 600)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, setDebouncedTerm])



  return (
    <div className="p-4 flex justify-between items-center">
      <Label htmlFor="search" className="sr-only">
        Search Pokémon
      </Label>
      <div className="relative flex-grow mr-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          placeholder="Search Pokémon"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="ml-2">
        {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    </div>
  )
}