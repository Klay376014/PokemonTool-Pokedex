import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { PokemonType } from '@/lib/schema'
import { calculateEffectiveness } from '@/utils'
import { useMemo } from 'react'
import { TypeBadge } from './type-badge'

interface TypeEffective {
  type: PokemonType[]
}


export function DefenseTypeTable({ type }: TypeEffective) {
  

  const typeEffectiveMap = useMemo(() => {
    if (!Array.isArray(type)) {
      return []
    }
    const typeMap = calculateEffectiveness(type)
    const result = Object.entries(typeMap).map(([multiplier, types]) => ({
      multiplier,
      types,
    }))
    return result
  }, [type])

  return (
    <Table>
      <TableBody>
        {typeEffectiveMap.map((effective) => (
          <TableRow key={effective.multiplier} className='border-b border-white'>
            <TableCell className="font-medium">{effective.multiplier}</TableCell>
            <TableCell>{effective.types.map(effectiveType => (
              <TypeBadge key={effectiveType} type={effectiveType as PokemonType} isTable={true} />
            ))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}