export const calculateStatRange = (baseStat: number, isHP = false, isLevel100 = false): [number, number] => {
  const level = isLevel100 ? 100 : 50
  const natureModifiers = [0.9, 1.1]
  
  if (isHP) {
    if (baseStat === 1) { // 特殊處理 Shedinja
      return [1, 1]
    }
    const minHP = Math.floor(((2 * baseStat + 0 + Math.floor(0 / 4)) * level) / 100) + level + 10
    const maxHP = Math.floor(((2 * baseStat + 31 + Math.floor(255 / 4)) * level) / 100) + level + 10
    return [minHP, maxHP]
  }
  
  const minStat = Math.floor((((2 * baseStat + 0 + Math.floor(0 / 4)) * level) / 100) + 5) * natureModifiers[0]
  const maxStat = Math.floor((((2 * baseStat + 31 + Math.floor(255 / 4)) * level) / 100) + 5) * natureModifiers[1]
  
  return [Math.floor(minStat), Math.floor(maxStat)]
}
