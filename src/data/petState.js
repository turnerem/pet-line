// rename file as petStateData

// export const shade = {
//   alert: "#F0FF36",
//   lazy: "#FFD700",
//   asleep: "#AFF5E9",
//   annoyed: "#2B2623"
// }

// watching tv, getting tickled, getting thrown, sleeping, napping, eating,
// daydreaming

export const petState = {
  average: {
    slope: -9,
    shade: "#FFD700",
    feetLocX: 190,
    leanDir: 'left'
  },
  alert: {
    slope: -100,
    shade: "#F0FF36",
    feetLocX: 190,
    leanDir: 'left'
  },
  bored: {
    slope: -2,
    shade: "#FFD700",
    feetLocX: 190,
    leanDir: 'left'
  },
  tired: {
    slope: -1.5,
    shade: "#7DACD7",
    feetLocX: 200,
    leanDir: 'left'
  },
  asleep: {
    slope: -0.2,
    shade: "#C54287",
    feetLocX: 300,
    leanDir: 'left'
  },
  annoyed: {
    slope: 3,
    shade: "#2B2623",
    feetLocX: 30,
    headLoc: {
      x1: 450, y1: 40
    }, 
    leanDir: 'right'
  }
}