import { test, expect, describe } from 'vitest'
import { isConditionsIntersect } from '../src/timeTextUtil.js'
function testFlipStabilityConditions(c1, c2, p = 120) {
  return isConditionsIntersect(c1, c2, p) === isConditionsIntersect(c2, c1, p)
}
const zeroPadding = 0
const defaultPadding = 120
describe('default', () => {
  test('overlay 10 minutes', () => {
    const c1 = [0, 0, 20, 0]
    const c2 = [10, 0, 30, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeTruthy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })
  test('tight', () => {
    const c1 = [0, 0, 20, 0]
    const c2 = [20, 0, 0, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeFalsy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })

  test('does not overlay', () => {
    const c1 = [0, 0, 10, 0]
    const c2 = [20, 0, 30, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeFalsy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })

  test('same conditions', () => {
    const c1 = [0, 0, 10, 0]
    const c2 = [0, 0, 10, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeTruthy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })
  test('one on top of other', () => {
    const c1 = [0, 0, 30, 0]
    const c2 = [10, 0, 20, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeTruthy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })

  test('depart same time', () => {
    const c1 = [0, 0, 30, 0]
    const c2 = [10, 0, 30, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeTruthy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })
  test('arrive same time', () => {
    const c1 = [0, 0, 30, 0]
    const c2 = [0, 0, 20, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeTruthy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })
})

describe('separated', () => {
  describe('success', () => {
    const c1 = [40, 0, 10, 0]
    const c2 = [5, 0, 15, 0]
    const c3 = [20, 0, 50, 0]
    const c4 = [30, 0, 20, 0]
    const c5 = [30, 0, 10, 0]

    test('overlay on left', () => {
      let result = isConditionsIntersect(c1, c2, zeroPadding)

      expect(result).toBeTruthy()
      expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
    })

    test('overlay on right', () => {
      let result = isConditionsIntersect(c1, c3, zeroPadding)

      expect(result).toBeTruthy()
      expect(testFlipStabilityConditions(c1, c3, zeroPadding)).toBeTruthy()
    })
    test('one on top of other', () => {
      let result = isConditionsIntersect(c1, c4, zeroPadding)

      expect(result).toBeTruthy()
      expect(testFlipStabilityConditions(c1, c4, zeroPadding)).toBeTruthy()
    })

    test('depart same time', () => {
      let result = isConditionsIntersect(c1, c5, zeroPadding)

      expect(result).toBeTruthy()

      expect(testFlipStabilityConditions(c1, c5, zeroPadding)).toBeTruthy()
    })
    test('arrive same time', () => {
      let result = isConditionsIntersect(c4, c5, zeroPadding)

      expect(result).toBeTruthy()

      expect(testFlipStabilityConditions(c4, c5, zeroPadding)).toBeTruthy()
    })
  })

  test('separated, fail', () => {
    const c1 = [40, 0, 10, 0]
    const c2 = [15, 0, 20, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeFalsy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })
  test('separated, same', () => {
    const c1 = [40, 0, 10, 0]
    const c2 = [40, 0, 10, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeTruthy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })
  test('separated, tight', () => {
    const c1 = [40, 0, 10, 0]
    const c2 = [10, 0, 40, 0]
    let result = isConditionsIntersect(c1, c2, zeroPadding)

    expect(result).toBeFalsy()

    expect(testFlipStabilityConditions(c1, c2, zeroPadding)).toBeTruthy()
  })
})

describe('dot', () => {
  describe('success', () => {
    const c1 = [0, 0, 0, 0]
    const c2 = [0, 0, 0, 0]
    const c3 = [2, 0, 2, 0]
    const c4 = [58, 0, 58, 0]
    test('zero and zero', () => {
      let result = isConditionsIntersect(c1, c2, defaultPadding)

      expect(result).toBeTruthy()

      expect(testFlipStabilityConditions(c1, c2, defaultPadding)).toBeTruthy()
    })
    test('zero and two', () => {
      let result = isConditionsIntersect(c1, c3, defaultPadding)

      expect(result).toBeTruthy()

      expect(testFlipStabilityConditions(c1, c3, defaultPadding)).toBeTruthy()
    })
    test('zero and 58', () => {
      let result = isConditionsIntersect(c1, c4, defaultPadding)

      expect(result).toBeTruthy()

      expect(testFlipStabilityConditions(c1, c4, defaultPadding)).toBeTruthy()
    })
  })

  test('fail', () => {
    const c1 = [0, 0, 0, 0]
    const c2 = [10, 0, 10, 0]
    let result = isConditionsIntersect(c1, c2, defaultPadding)

    expect(result).toBeFalsy()

    expect(testFlipStabilityConditions(c1, c2, defaultPadding)).toBeTruthy()
  })
  describe('tight', () => {
    const c1 = [0, 0, 0, 0]
    const c2 = [4, 0, 4, 0]
    const c3 = [56, 0, 56, 0]

    test('left', () => {
      let result = isConditionsIntersect(c1, c2, defaultPadding)

      expect(result).toBeFalsy()

      expect(testFlipStabilityConditions(c1, c2, defaultPadding)).toBeTruthy()
    })
    test('right', () => {
      let result = isConditionsIntersect(c1, c3, defaultPadding)
      expect(result).toBeFalsy()

      expect(testFlipStabilityConditions(c1, c3, defaultPadding)).toBeTruthy()
    })
  })
})
