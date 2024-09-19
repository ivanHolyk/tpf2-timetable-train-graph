import { isTimeInRange } from '../src/timeTextUtil'
import { expect, test } from 'vitest'

const defaultPadding = 120
const zeroPadding = 0

const testSuite = [
  {
    time: 0,
    condition: [0, 0, 2, 0],
    padding: defaultPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 0,
    condition: [0, 0, 2, 0],
    padding: zeroPadding,
    isTouch: false,
    expected: false
  },
  {
    time: 0,
    condition: [0, 0, 2, 0],
    padding: zeroPadding,
    isTouch: false,
    expected: false
  },
  {
    time: 3480,
    condition: [0, 0, 2, 0],
    padding: defaultPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 0,
    condition: [0, 0, 58, 0],
    padding: defaultPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 0,
    condition: [0, 0, 58, 0],
    padding: defaultPadding,
    isTouch: false,
    expected: false
  },
  {
    time: 120,
    condition: [0, 0, 2, 0],
    padding: zeroPadding,
    isTouch: false,
    expected: false
  },
  {
    time: 120,
    condition: [0, 0, 2, 0],
    padding: zeroPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 120,
    condition: [0, 0, 2, 0],
    padding: defaultPadding,
    isTouch: false,
    expected: true
  },
  {
    time: 120,
    condition: [0, 0, 2, 0],
    padding: defaultPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 120,
    condition: undefined,
    padding: defaultPadding,
    isTouch: true,
    expected: false
  },
  {
    time: 120,
    condition: [0, 0, 0, 0],
    padding: defaultPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 120,
    condition: [0, 0, 0, 0],
    padding: zeroPadding,
    isTouch: true,
    expected: false
  },
  {
    time: 120,
    condition: [0, 0, 0, 0],
    padding: zeroPadding,
    isTouch: false,
    expected: false
  },

  {
    time: 3480,
    condition: [0, 0, 0, 0],
    padding: defaultPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 0,
    condition: [2, 0, 2, 0],
    padding: defaultPadding,
    isTouch: true,
    expected: true
  },
  {
    time: 0,
    condition: [2, 0, 2, 0],
    padding: defaultPadding,
    isTouch: false,
    expected: false
  },
  {
    time: 240,
    condition: [2, 0, 2, 0],
    padding: defaultPadding,
    isTouch: false,
    expected: false
  }
]
test.each(testSuite)(
  '$time $condition $padding $isTouch $expected',
  ({ time, condition, padding, isTouch, expected }) => {
    expect(isTimeInRange(time, condition, padding, isTouch)).toBe(expected)
  }
)
