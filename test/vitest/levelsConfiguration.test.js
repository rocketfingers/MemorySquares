import { describe, it, expect } from 'vitest'
import { levelsConfiguration } from 'src/levelsConfiguration.js'

describe('levelsConfiguration', () => {
  it('has at least 124 levels (24 hand-crafted + 100 generated)', () => {
    expect(levelsConfiguration.length).toBe(124)
  })

  it('every level has columns and rotate properties', () => {
    levelsConfiguration.forEach((level, index) => {
      expect(level).toHaveProperty('columns')
      expect(level).toHaveProperty('rotate')
      expect(typeof level.columns).toBe('number')
      expect(typeof level.rotate).toBe('boolean')
    })
  })

  it('columns are always between 3 and 6', () => {
    levelsConfiguration.forEach((level) => {
      expect(level.columns).toBeGreaterThanOrEqual(3)
      expect(level.columns).toBeLessThanOrEqual(6)
    })
  })

  describe('hand-crafted levels', () => {
    it('rounds 1-3 have 3 columns', () => {
      expect(levelsConfiguration[0].columns).toBe(3)
      expect(levelsConfiguration[1].columns).toBe(3)
      expect(levelsConfiguration[2].columns).toBe(3)
    })

    it('rounds 4-9 have 4 columns', () => {
      for (let i = 3; i <= 8; i++) {
        expect(levelsConfiguration[i].columns).toBe(4)
      }
    })

    it('rounds 10-15 have 5 columns', () => {
      for (let i = 9; i <= 14; i++) {
        expect(levelsConfiguration[i].columns).toBe(5)
      }
    })

    it('round 17 drops to 4 columns with rotation', () => {
      expect(levelsConfiguration[16]).toEqual({ columns: 4, rotate: true })
    })

    it('rounds 21-24 have 6 columns', () => {
      for (let i = 20; i <= 23; i++) {
        expect(levelsConfiguration[i].columns).toBe(6)
      }
    })
  })

  describe('rotation pattern', () => {
    it('round 3 has rotation', () => {
      expect(levelsConfiguration[2].rotate).toBe(true)
    })

    it('round 9 has rotation', () => {
      expect(levelsConfiguration[8].rotate).toBe(true)
    })

    it('round 17 has rotation', () => {
      expect(levelsConfiguration[16].rotate).toBe(true)
    })

    it('round 20 has rotation', () => {
      expect(levelsConfiguration[19].rotate).toBe(true)
    })

    it('round 24 has rotation', () => {
      expect(levelsConfiguration[23].rotate).toBe(true)
    })

    it('rounds 1 and 2 do not have rotation', () => {
      expect(levelsConfiguration[0].rotate).toBe(false)
      expect(levelsConfiguration[1].rotate).toBe(false)
    })
  })

  describe('generated levels (25+)', () => {
    it('all have 6 columns', () => {
      for (let i = 24; i < levelsConfiguration.length; i++) {
        expect(levelsConfiguration[i].columns).toBe(6)
      }
    })
  })
})
