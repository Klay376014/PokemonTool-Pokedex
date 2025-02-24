import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface Ability {
  name: string
  description: string
  abilityType: string
}

function AbilityPopover({ ability }: { ability: Ability }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`rounded-full px-4 py-1 text-sm ${ability.abilityType === 'H' ? 'text-red-600 hover:text-red-300' : ''}`}>
          {ability.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {ability.name}
            </h4> 
            <p className="text-sm text-muted-foreground">{ability.description}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AbilityPopover