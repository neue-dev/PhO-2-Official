/**
 * Implements dark mode toggling
 */

(function() {
  const toggler = document.querySelectorAll('.darkmode-toggle')[0];
  const lightSwitch = document.querySelectorAll('.darkmode-toggle-switch')[0];
  const ROOT = document.querySelector(':root');
  const RS = getComputedStyle(ROOT);

  const DEFAULT_MODE = {
    '--bg1': '#ffffff',
    '--bg2': '#f5f5f5',
    '--bg3': '#616161',
    '--bg4': '#212121',

    '--navbg': '#212121',
    '--btnbg': '#ffffff',
    '--posbg': '#c8e8c8',
    '--posfg': '#4caf50',
    '--adminbg': '#d32f2f',
    '--adminfg': '#f0f0f0',

    '--fg1': '#272727',
    '--fg2': '#323232',
    '--fg3': '#eeeeee',
    '--fg4': '#f5f5f5',

    '--scroll': '#616161',
    '--scrollhover': '#424242',
    '--shadow': '0 2px 4px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23)',
    '--hover': 'rgba(0, 0, 0, 0.1)',
    '--logo': 'invert(0)',
  };

  const DARK_MODE = {
    '--bg1': '#181818',
    '--bg2': '#242424',
    '--bg3': '#aaaaaa',
    '--bg4': '#cccccc',

    '--navbg': '#181818',
    '--btnbg': '#e2e2e2',
    '--posbg': '#aaaaaa',
    '--posfg': '#212121',
    '--adminbg': '#aaaaaa',
    '--adminfg': '#b71c1c',

    '--fg1': '#cccccc',
    '--fg2': '#bbbbbb',
    '--fg3': '#555555',
    '--fg4': '#212121',

    '--scroll': '#616161',
    '--scrollhover': '#808080',
    '--shadow': '0 4px 6px rgba(0,0,0,0.33), 0 3px 3px rgba(0,0,0,0.4)',
    '--hover': 'rgba(255, 255, 255, 0.05)',
    '--logo': 'grayscale(1) invert(0.9)',
  };

  // Set to default mode at first
  if(!localStorage.getItem('displayMode'))
    localStorage.setItem('displayMode', 'default');

  function setDefaultMode() {
    let props = Object.keys(DEFAULT_MODE);
    let icons = document.getElementsByClassName('pho2-icon');
    
    for(let i = 0; i < icons.length; i++)
      icons[i].src = './pho-2-icon';
    
    for(let i = 0; i < props.length; i++) {
      ROOT.style.setProperty(props[i], DEFAULT_MODE[props[i]]);
    }

    document.body.style.opacity = '1';
  }

  function setDarkMode() {
    let props = Object.keys(DARK_MODE);
    let icons = document.getElementsByClassName('pho2-icon');
    
    for(let i = 0; i < icons.length; i++)
      icons[i].src = './pho-2-icon-dark';

    for(let i = 0; i < props.length; i++)
      ROOT.style.setProperty(props[i], DARK_MODE[props[i]]);

    document.body.style.opacity = '1';
  }

  window.addEventListener('DOMContentLoaded', e => {
    if(localStorage.getItem('displayMode') == 'default')
      lightSwitch.checked = setDefaultMode() && false;
    else lightSwitch.checked = setDarkMode() || true;
  })

  // Add the event listener to the light switch
  toggler.addEventListener('click', e => {
    localStorage.setItem('displayMode', lightSwitch.checked ? 'dark' : 'default');

    if(localStorage.getItem('displayMode') == 'default')
      setDefaultMode();

    if(localStorage.getItem('displayMode') == 'dark')
      setDarkMode();
  });

  // Set things up
  if(localStorage.getItem('displayMode') == 'default') setDefaultMode();
  if(localStorage.getItem('displayMode') == 'dark') setDarkMode();
})();