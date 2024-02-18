/**
 * Implements dark mode toggling
 */

(function() {
  const ROOT = document.querySelector(':root');
  const RS = getComputedStyle(ROOT);

  console.log(RS.getPropertyValue('--bg1'));

  RS.setProperty('--bg1', '#181818');
  RS.setProperty('--bg2', '#181818');
  RS.setProperty('--bg3', '#181818');

  RS.setProperty('--bg4', '#181818');
})();