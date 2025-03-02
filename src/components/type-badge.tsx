import { Badge } from '@/components/ui/badge'

export type TypeColorKeys = keyof typeof typeColors

interface TypeBadgeProps {
  type: TypeColorKeys
  isTable: boolean
}

const typeColors = {
  Normal: { bg: 'bg-gray-700', hover: 'hover:bg-gray-400' },
  Fire: { bg: 'bg-red-700', hover: 'hover:bg-red-400' },
  Water: { bg: 'bg-blue-700', hover: 'hover:bg-blue-400' },
  Electric: { bg: 'bg-yellow-700', hover: 'hover:bg-yellow-400' },
  Grass: { bg: 'bg-green-700', hover: 'hover:bg-green-400' },
  Ice: { bg: 'bg-cyan-700', hover: 'hover:bg-cyan-400' },
  Fighting: { bg: 'bg-orange-700', hover: 'hover:bg-orange-400' },
  Poison: { bg: 'bg-purple-700', hover: 'hover:bg-purple-400' },
  Ground: { bg: 'bg-yellow-950', hover: 'hover:bg-yellow-900' },
  Flying: { bg: 'bg-sky-700', hover: 'hover:bg-sky-400' },
  Psychic: { bg: 'bg-pink-700', hover: 'hover:bg-pink-400' },
  Bug: { bg: 'bg-lime-800', hover: 'hover:bg-lime-500' },
  Rock: { bg: 'bg-amber-900', hover: 'hover:bg-amber-600' },
  Ghost: { bg: 'bg-indigo-800', hover: 'hover:bg-indigo-500' },
  Dragon: { bg: 'bg-teal-800', hover: 'hover:bg-teal-500' },
  Dark: { bg: 'bg-zinc-900', hover: 'hover:bg-zinc-700' },
  Steel: { bg: 'bg-gray-800', hover: 'hover:bg-gray-500' },
  Fairy: { bg: 'bg-pink-500', hover: 'hover:bg-pink-300' },
  None: { bg: 'bg-black', hover: 'bg-black-800'}
}

export function TypeBadge({ type, isTable = false }: TypeBadgeProps) {
  const colors = typeColors[type] || { bg: 'bg-gray-700', hover: 'hover:bg-gray-400' }
  return (
    <Badge key={type} className={`${colors.bg} ${colors.hover} text-white border-gray-600 m-1 ${isTable ? 'text-xs' : 'text-sm'}`}>
      {type}
    </Badge>
  )
}