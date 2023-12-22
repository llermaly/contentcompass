export const getScoreText = (score: number) => {
  if (score <= 0) {
    return "Your content doesn't follow the guidelines in any way.";
  }
  if (score <= 4) {
    return "Your content doesn't follow the guidelines very well.";
  }
  if (score <= 5) {
    return "Your content follows the guidelines to some extent.";
  }
  if (score <= 7) {
    return "Your content follows the guidelines well.";
  }
  if (score <= 10) {
    return "Your content follows the guidelines perfectly.";
  }
};
