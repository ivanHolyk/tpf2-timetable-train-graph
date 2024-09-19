import { calculateTrainAndRow } from '../src/timeTextUtil'
import { test, expect } from 'vitest'
const defaultPadding = 120
test('line66', () => {
  const data = {
    lineName: '605709 - Line 66',
    maxRowWithDefaulPadding: 8,
    maxTrainsWithDefalutPadding: 13,
    conditions: [
      [0, 0, 15, 0],
      [3, 0, 18, 0],
      [6, 0, 21, 0],
      [9, 0, 24, 0],
      [12, 0, 27, 0],
      [15, 0, 30, 0],
      [18, 0, 33, 0],
      [21, 0, 36, 0],
      [24, 0, 39, 0],
      [27, 0, 42, 0],
      [30, 0, 45, 0],
      [33, 0, 48, 0],
      [36, 0, 51, 0],
      [39, 0, 54, 0],
      [42, 0, 57, 0],
      [45, 0, 0, 0],
      [48, 0, 3, 0],
      [51, 0, 6, 0],
      [54, 0, 9, 0],
      [57, 0, 12, 0]
    ]
  }
  const result = calculateTrainAndRow(data.conditions, defaultPadding)

  expect(result.rowAmountToDisplayByLine).toBe(data.maxRowWithDefaulPadding)
})
