const score = (obj) => {
  let finalScore = 0;
  for (const [key, value] of Object.entries(obj)) {
    finalScore += value;
  }
  return (finalScore /= Object.keys(obj).length);
};

module.exports = score;
