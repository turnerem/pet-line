// export const shade = {
//   alert: "#F0FF36",
//   lazy: "#FFD700",
//   asleep: "#AFF5E9",
//   annoyed: "#2B2623"
// }

export const petState = {
  average: {
    slope: -9,
    shade: "#FFD700",
    headLoc: {
      x1: 50, y1: 30
    }, 
    leanDir: 'left'
  },
  alert: {
    slope: null,
    shade: "#F0FF36",
    headLoc: {
      x1: 50, y1: 20
    }, 
    leanDir: 'left'
  },
  bored: {
    slope: -2,
    shade: "#FFD700",
    headLoc: {
      x1: 50, y1: 50
    }, 
    leanDir: 'left'
  },
  tired: {
    slope: -1.5,
    shade: "#7DACD7",
    headLoc: {
      x1: 50, y1: 80
    }, 
    leanDir: 'left'
  },
  asleep: {
    slope: -0.2,
    shade: "#C54287",
    headLoc: {
      x1: 10, y1: 200
    }, 
    leanDir: 'left'
  },
  annoyed: {
    slope: -3,
    shade: "#2B2623",
    headLoc: {
      x1: 450, y1: 40
    }, 
    leanDir: 'right'
  }
}