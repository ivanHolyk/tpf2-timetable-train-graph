import { calculateTrainAndRow } from '../src/timeTextUtil'
import { expect, describe, test } from 'vitest'
const defaultPadding = 120
// const zeroPadding = 0
const stations = [
  {
    stationName: 'Station - 269488 Mende Rail Hub 1',
    lines: [
      {
        lineName: '229018 - [IHC Thionville - Mende] Boxcar',
        maxRowWithDefaulPadding: 4,
        maxTrainsWithDefalutPadding: 7,
        conditions: [
          [0, 0, 8, 0],
          [3, 0, 11, 0],
          [6, 0, 14, 0],
          [9, 0, 17, 0],
          [12, 0, 20, 0],
          [15, 0, 23, 0],
          [18, 0, 26, 0],
          [21, 0, 29, 0],
          [24, 0, 32, 0],
          [27, 0, 35, 0],
          [30, 0, 38, 0],
          [33, 0, 41, 0],
          [36, 0, 44, 0],
          [39, 0, 47, 0],
          [42, 0, 50, 0],
          [45, 0, 53, 0],
          [48, 0, 56, 0],
          [51, 0, 59, 0],
          [54, 0, 2, 0],
          [57, 0, 5, 0]
        ]
      },
      {
        lineName: '230279 - [IHC Thionville - Mende] Flatcar',
        maxRowWithDefaulPadding: 2,
        maxTrainsWithDefalutPadding: 3,
        conditions: [
          [0, 0, 0, 0],
          [3, 0, 3, 0],
          [6, 0, 6, 0],
          [9, 0, 9, 0],
          [12, 0, 12, 0],
          [15, 0, 15, 0],
          [18, 0, 18, 0],
          [21, 0, 21, 0],
          [24, 0, 24, 0],
          [27, 0, 27, 0],
          [30, 0, 30, 0],
          [33, 0, 33, 0],
          [36, 0, 36, 0],
          [39, 0, 39, 0],
          [42, 0, 42, 0],
          [45, 0, 45, 0],
          [48, 0, 48, 0],
          [51, 0, 51, 0],
          [54, 0, 54, 0],
          [57, 0, 57, 0]
        ]
      },
      {
        lineName: '251285 - [IHC Thionville - Mende] Gondola',
        maxRowWithDefaulPadding: 4,
        maxTrainsWithDefalutPadding: 7,
        conditions: [
          [0, 0, 7, 0],
          [3, 0, 10, 0],
          [6, 0, 13, 0],
          [9, 0, 16, 0],
          [12, 0, 19, 0],
          [15, 0, 22, 0],
          [18, 0, 25, 0],
          [21, 0, 28, 0],
          [24, 0, 31, 0],
          [27, 0, 34, 0],
          [30, 0, 37, 0],
          [33, 0, 40, 0],
          [36, 0, 43, 0],
          [39, 0, 46, 0],
          [42, 0, 49, 0],
          [45, 0, 52, 0],
          [48, 0, 55, 0],
          [51, 0, 58, 0],
          [54, 0, 1, 0],
          [57, 0, 4, 0]
        ]
      }
    ]
  },
  {
    stationName: 'Station - 58312 Torcy',
    lines: [
      {
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
    ]
  },
  {
    stationName: 'Station - 156122 Les Mureaux',
    lines: [
      {
        lineName: '230364 - Line 86',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [
          [0, 0, 0, 0],
          [12, 0, 12, 0],
          [24, 0, 24, 0],
          [36, 0, 36, 0],
          [48, 0, 48, 0]
        ]
      }
    ]
  },
  {
    stationName: 'Station - 420300 Mende Rail Hub 2',
    lines: [
      {
        lineName: '179281 - [BIC] Talence Hub - Car Factory{Textiles}',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [[44, 0, 56, 0]]
      },
      {
        lineName: '211480 - [IHC Talence - Mende] Flatcar',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [
          [0, 0, 7, 0],
          [15, 0, 22, 0],
          [30, 0, 37, 0],
          [45, 0, 52, 0]
        ]
      },
      {
        lineName: '328708 - [BIC] Talence Hub - Car Factory{Steel}',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [
          [3, 0, 6, 0],
          [18, 0, 21, 0],
          [33, 0, 36, 0],
          [48, 0, 51, 0]
        ]
      },
      {
        lineName: '412618 - [IHC Talence - Mende] Tanker',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [[4, 0, 32, 0]]
      },

      {
        lineName: '412748 - [IHC Talence - Mende] Gondola',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [
          [2, 0, 9, 0],
          [17, 0, 24, 0],
          [32, 0, 39, 0],
          [47, 0, 54, 0]
        ]
      },
      {
        lineName: '425264 - [IHC Annonay - Mende] Flatcar',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [[8, 0, 31, 0]]
      },
      {
        lineName: '428484 - [IHC Talence - Mende] Boxcar',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [
          [0, 0, 5, 0],
          [10, 0, 15, 0],
          [20, 0, 25, 0],
          [30, 0, 35, 0],
          [40, 0, 45, 0],
          [50, 0, 55, 0]
        ]
      },
      {
        lineName: '762499 - [BIC] Talence Hub - Car Factory{Machines}',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [[29, 0, 41, 0]]
      },
      {
        lineName: '767449 - [BIC] Talence Hub - Car Factory{Glass}',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [[14, 0, 26, 0]]
      },
      {
        lineName: '1002297 - [IHC Annonay - Mende] Tanker',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [[12, 0, 35, 0]]
      },
      {
        lineName: '1045448 - [IHC Annonay - Mende] Boxcar',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [
          [6, 0, 18, 0],
          [36, 0, 48, 0]
        ]
      },
      {
        lineName: '1049123 - [IHC Annonay - Mende] Gondola',
        maxRowWithDefaulPadding: 1,
        maxTrainsWithDefalutPadding: 1,
        conditions: [
          [10, 0, 22, 0],
          [40, 0, 52, 0]
        ]
      }
    ]
  }
]

describe.each(stations)('$stationName', ({ lines }) => {
  describe.each(lines)(
    '$lineName',
    ({ maxTrainsWithDefalutPadding, maxRowWithDefaulPadding, conditions }) => {
      const result = calculateTrainAndRow(conditions, defaultPadding)

      test(`defined ${JSON.stringify(result)}`, () => {
        expect(result).toBeDefined()
      })

      test(`row expect ${maxRowWithDefaulPadding}, actual ${result.rowAmountToDisplayByLine}`, () => {
        expect(result.rowAmountToDisplayByLine).toBe(maxRowWithDefaulPadding)
      })

      test(`trains expect ${maxTrainsWithDefalutPadding}, acutal ${result.maxTrainsOnStationByLine}`, () => {
        expect(result.maxTrainsOnStationByLine).toBe(maxTrainsWithDefalutPadding)
      })
    }
  )
})
