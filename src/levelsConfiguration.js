// Generate array of level configurations
const generateLevels = () => {
  const levels = [
    { columns: 3, rotate: false },
    { columns: 3, rotate: false },
    { columns: 3, rotate: true },

    { columns: 4, rotate: false },
    { columns: 4, rotate: false },
    { columns: 4, rotate: false },
    { columns: 4, rotate: false },
    { columns: 4, rotate: false },
    { columns: 4, rotate: true },

    { columns: 5, rotate: false },
    { columns: 5, rotate: false },
    { columns: 5, rotate: false },
    { columns: 5, rotate: false },
    { columns: 5, rotate: false },
    { columns: 5, rotate: false },
    { columns: 5, rotate: false },
    { columns: 4, rotate: true },
    { columns: 5, rotate: false },
    { columns: 5, rotate: false },
    { columns: 5, rotate: true },

    { columns: 6, rotate: false },
    { columns: 6, rotate: false },
    { columns: 6, rotate: false },
    { columns: 6, rotate: true },
  ]

  // Add 100 levels with columns: 6 and random rotate
  for (let i = 0; i < 100; i++) {
    levels.push({
      columns: 6,
      rotate: Math.random() > 0.6,
    })
  }

  return levels
}

export const levelsConfiguration = generateLevels()
