export const useHaptic = () => {
  const triggerLight = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const triggerMedium = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const triggerHeavy = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const triggerSuccess = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  };

  const triggerError = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  };

  return {
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerError,
  };
};
