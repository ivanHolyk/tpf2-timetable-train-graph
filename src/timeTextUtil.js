export function getTime(halfCondition) {
  let minutes = isNumber(halfCondition)
    ? Math.floor(halfCondition / 60)
    : String(halfCondition[0]).padStart(2, "0")
  let seconds = isNumber(halfCondition)
    ? halfCondition % 60
    : String(halfCondition[1]).padStart(2, "0")

  return `${minutes}:${seconds}`
}
export function getRangeText(condition) {
  // const t1 = condition[0] * 60 + condition[1]
  // const t2 = condition[2] * 60 + condition[3]
  // const t = t2 - t1
  // let minutes = Math.floor(t / 60)
  // let seconds = t % 60
  // if (minutes < 10) {
  //   minutes = `0${minutes}`
  // }
  // if (seconds < 10) {
  //   seconds = `0${seconds}`
  // }
  // return `${minutes}:${seconds}`
  return getTime(getRangeSeconds(condition))
}
import { isArray, isNumber } from "lodash"

export function secondsOf(o) {
  return isArray(o) ? o[0] * 60 + o[1] : o
}
export function parseCondition(condition) {
  if (
    condition.arrivalSeconds !== undefined &&
    condition.departureSeconds !== undefined
  ) {
    return condition
  } else {
    return {
      arrivalSeconds: secondsOf(condition.slice(0, 2)),
      departureSeconds: secondsOf(condition.slice(2)),
    }
  }
}

export function isArrivalBeforeDeparture(departure, arrival) {
  departure = secondsOf(departure)
  arrival = secondsOf(arrival)
  return arrival < departure
}
export function getRangeSeconds(condition) {
  if (isDotCondition(condition)) {
    return 0
  }

  let { arrivalSeconds, departureSeconds } = parseCondition(condition)
  let result
  result = departureSeconds - arrivalSeconds
  return result > 0 ? result : result + 3600
}
export function isDotCondition(condition, padding = 0) {
  let { arrivalSeconds, departureSeconds } = parseCondition(condition)
  return arrivalSeconds === departureSeconds && padding === 0
}

export function isTimeInRange(time, condition, padding, isTouch = true) {
  let result = false
  if (!condition) {
    return false
  }
  time = secondsOf(time)

  let { arrivalSeconds, departureSeconds } = parseCondition(condition)

  departureSeconds = departureWithPadding(departureSeconds, padding)
  arrivalSeconds = arrivalWithPadding(arrivalSeconds, padding)

  if (isDotCondition(condition, padding)) {
    result = isTouch && arrivalSeconds === time && departureSeconds === time
  } else if (arrivalSeconds < departureSeconds) {
    if (isTouch) {
      result = time >= arrivalSeconds && time <= departureSeconds
    } else {
      result = time > arrivalSeconds && time < departureSeconds
    }
  } else {
    if (isTouch) {
      result =
        (time <= departureSeconds && time >= 0) ||
        (time >= arrivalSeconds && time <= 3600)
    } else {
      result =
        (time < departureSeconds && time >= 0) ||
        (time > arrivalSeconds && time <= 3600)
    }
  }
  return result
}
export function isConditionsIntersect(arr1, arr2, padding = 120) {
  if (!arr1 || !arr2) {
    return false
  }

  const c1 = parseCondition(arr1)
  const c2 = parseCondition(arr2)
  if (isCoditionsTouch(c1, c2, padding)) {
    return false
  }
  if (
    c1.arrivalSeconds === c2.arrivalSeconds &&
    c1.departureSeconds === c2.departureSeconds
  ) {
    return true
  }

  return (
    isTimeInRange(
      arrivalWithPadding(c1.arrivalSeconds, padding),
      c2,
      padding,
    ) ||
    isTimeInRange(
      departureWithPadding(c1.departureSeconds, padding),
      c2,
      padding,
    ) ||
    isTimeInRange(
      arrivalWithPadding(c2.arrivalSeconds, padding),
      c1,
      padding,
    ) ||
    isTimeInRange(
      departureWithPadding(c2.departureSeconds, padding),
      c1,
      padding,
    )
  )
}
export function getTimeText(condition) {
  let result = ""
  if (condition[0] == 1) {
    result += "minute"
  } else if (condition[0] > 1) {
    result += condition[0] + " minutes"
  }
  if (condition[1] == 1) {
    result += " " + condition[1] + " second"
  } else if (condition[1] > 1) {
    result += " " + condition[1] + " seconds"
  }
  return result
}

export function calculateTrainAndRow(arrDep, padding) {
  if (!arrDep) {
    return 0
  }
  if (arrDep.length == 1) {
    return {
      maxTrainsOnStationByLine: 1,
      rowAmountToDisplayByLine: 1,
    }
  }
  let trainResult = []
  let arrResult = []
  let depResult = []
  let rowResult = []

  for (let i = 0; arrDep.length; i++) {
    trainResult[i] = 0
    arrResult[i] = 0
    depResult[i] = 0
    rowResult[i] = 0
    if (isLast(arrDep, i)) {
      break
    }
    if (i === 0) {
      arrResult[i]++
      depResult[i]++
      // result[i]++
    }
    const arrDepI = arrDep[i]
    for (let j = 0; arrDep.length; j++) {
      if (isLast(arrDep, j)) {
        break
      }
      const arrDepJ = arrDep[j]

      // if (
      //   isTimeInRange(
      //     arrivalWithPadding(parseCondition(arrDepJ).arrivalSeconds, padding),
      //     arrDepI,
      //     padding,
      //     false
      //   )
      // ) {
      //   arrResult[i]++
      // }
      // if (
      //   isTimeInRange(
      //     departureWithPadding(parseCondition(arrDepJ).departureSeconds, padding),
      //     arrDepI,
      //     padding,
      //     false
      //   )
      // ) {
      //   depResult[i]++
      // }
      if (i === j) {
        arrResult[i]++
        depResult[i]++
        continue
      }
      if (
        isTimeInRange(
          arrivalWithPadding(parseCondition(arrDepI).arrivalSeconds, padding),
          arrDepJ,
          padding,
          false,
        )
      ) {
        arrResult[i]++
      }
      if (
        isTimeInRange(
          departureWithPadding(
            parseCondition(arrDepI).departureSeconds,
            padding,
          ),
          arrDepJ,
          padding,
          false,
        )
      ) {
        depResult[i]++
      }

      if (isConditionsIntersect(arrDepI, arrDepJ, padding)) {
        trainResult[i]++
      }
    }

    // rowResult[i] = arrResult[i] + depResult[i]
  }
  // console.log(rowResult)
  console.log(arrResult)
  console.log(depResult)

  console.log(arrDep)
  console.log("======================================")
  return {
    maxTrainsOnStationByLine:
      Math.max(...trainResult) > 0
        ? Math.max(...trainResult)
        : arrDep.length + 1,
    rowAmountToDisplayByLine:
      Math.max(...arrResult, ...depResult) > 0
        ? Math.max(...arrResult, ...depResult)
        : arrDep.length + 1,
    // rowAmountToDisplayByLine: Math.max(...rowResult)
  }
}
function isLast(arr, i) {
  return arr.length == i
}
export function isCoditionsTouch(c1, c2, padding) {
  const c1Arr = arrivalWithPadding(c1.arrivalSeconds, padding)
  const c1Dep = departureWithPadding(c1.departureSeconds, padding)
  const c2Arr = arrivalWithPadding(c2.arrivalSeconds, padding)
  const c2Dep = departureWithPadding(c2.departureSeconds, padding)
  return c1Arr == c2Dep || c1Dep == c2Arr
}
export function arrivalWithPadding(time, padding) {
  return time - padding >= 0 ? time - padding : time - padding + 3600
}
export function departureWithPadding(time, padding) {
  return time + padding < 3600 ? time + padding : time + padding - 3600
}
