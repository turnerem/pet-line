// At first, pet line will have simple wants:
  // eat
  // sleep
  // normal (just wandering about)
// each want will have a numeric integer value, updated periodically with a call to updateWants
// decideActivity periodically balances competing wants and returns ultimateWant
// setActivity changes activity to that of ultimateWant if not already doing that activity
  // when changing activity, always transition through changeover state
// updateMood
  // called periodically, trajectory determined by anxiety and unmetWants
  // called when actions taken, as response to getting its way, or not
// updateAnxiety is a random walk that looks after itself
// try incorporate poisson process and other cute probability distributions in pet line psyche

