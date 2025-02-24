import { Button } from '@/components/ui/button'
import ModeToggle from './modo-toggle'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-200 text-white shadow-md dark:bg-neutral-900 dark:text-gray-200">
      <div className="flex items-center">
        <img src="/src/assets/default.png" alt="Logo" className="w-10 h-10" />
      </div>

      <div className="flex space-x-6">
        <a className="text-primary hover:underline">
          <Button variant="ghost">Home</Button>
        </a>
        <a className="text-primary hover:underline">
          <Button variant="ghost">About</Button>
        </a>
        <a className="text-primary hover:underline">
          <Button variant="ghost">FAQs</Button>
        </a>
      </div>

      <div>
        <ModeToggle />
      </div>
    </nav>
  )
}
