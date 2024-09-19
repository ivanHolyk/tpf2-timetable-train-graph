import { arrivalWithPadding, departureWithPadding } from '../src/timeTextUtil'
import { expect, describe, test } from 'vitest'

const defaultPadding = 120
// const zeroPadding = 0
const testSuite = {
  arrival: [
    {
      arrival: 0,
      padding: defaultPadding,
      expected: 3480
    },
    {
      arrival: 120,
      padding: defaultPadding,
      expected: 0
    },
    {
      arrival: 600,
      padding: defaultPadding,
      expected: 480
    },
    {
      arrival: 60,
      padding: defaultPadding,
      expected: 3540
    }
  ],
  departure: [
    {
      departure: 0,
      padding: defaultPadding,
      expected: 120
    },
    {
      departure: 3480,
      padding: defaultPadding,
      expected: 0
    },
    {
      departure: 600,
      padding: defaultPadding,
      expected: 720
    },
    {
      departure: 3500,
      padding: defaultPadding,
      expected: 20
    }
  ]
}
describe('Arrival', () => {
  test.each(testSuite.arrival)(
    'arrival $arrival, padding $padding, expected $expected',
    ({ arrival, padding, expected }) => {
      expect(arrivalWithPadding(arrival, padding)).toBe(expected)
    }
  )
})
describe('Departure', () => {
  test.each(testSuite.departure)(
    'departure $departure, padding $padding, expected $expected',
    ({ departure, padding, expected }) => {
      expect(departureWithPadding(departure, padding)).toBe(expected)
    }
  )
})
