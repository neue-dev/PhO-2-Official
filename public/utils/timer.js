const timer = document.getElementsByClassName('timer')[0];

const displayTime = interval => {
  return `
    <pre style="display: inline-block"><b>${Math.floor(interval / 60 / 60 / 24 / 1000)} &Tab;</b></pre> 
      <span style="font-size: 0.75em;">days</span><br>
    <pre style="display: inline-block"><b>${(Math.floor(interval / 60 / 60 / 1000) % 24 < 10 ? '0' : '') + Math.floor(interval / 60 / 60 / 1000) % 24} &Tab;</b></pre> 
      <span style="font-size: 0.75em">hrs</span><br>
    <pre style="display: inline-block"><b>${(Math.floor(interval / 60 / 1000) % 60 < 10 ? '0': '') + Math.floor(interval / 60 / 1000) % 60} &Tab;</b></pre> 
      <span style="font-size: 0.75em">mins</span><br>
    <pre style="display: inline-block"><b>${(Math.floor(interval / 1000) % 60 < 10 ? '0' : '') + Math.floor(interval / 1000) % 60} &Tab;</b></pre> 
      <span style="font-size: 0.75em">secs</span><br>`;
}

const updateInterval = () => {

  // Timer
  let now = parseInt(Date.now());
  let contest_elims_start = parseInt(localStorage.getItem('CONTEST_ELIMS_START'));
  let contest_elims_end = parseInt(localStorage.getItem('CONTEST_ELIMS_END'));
  let contest_finals_start = parseInt(localStorage.getItem('CONTEST_FINALS_START'));
  let contest_finals_end = parseInt(localStorage.getItem('CONTEST_FINALS_END'));

  // The contest hasn't begun
  if(now < contest_elims_start) {
    timer.innerHTML = `
      <h4 style="margin-bottom: 24px; margin-top: 8px;">${displayTime(contest_elims_start - now)}</h4>
      <p class="timer-label">BEFORE ELIMINATIONS BEGIN</p>`;
  
  // The eliminations are underway
  } else if(contest_elims_start <= now && now < contest_elims_end) {
    timer.innerHTML = `
      <h4 style="margin-bottom: 24px; margin-top: 8px;">${displayTime(contest_elims_end - now)}</h4>
      <p class="timer-label">BEFORE ELIMINATIONS END</p>`;
  
  // The elims are done, waiting for finals
  } else if(contest_elims_end <= now && now < contest_finals_start) {
    timer.innerHTML = `
      <h4 style="margin-bottom: 24px; margin-top: 8px;">${displayTime(contest_finals_start - now)}</h4>
      <p class="timer-label">BEFORE FINALS BEGIN</p>`;
  
  // The finals are underway
  } else if(contest_finals_start <= now && now < contest_finals_end) {
    timer.innerHTML = `
      <h4 style="margin-bottom: 24px; margin-top: 8px;">${displayTime(contest_finals_end - now)}</h4>
      <p class="timer-label">BEFORE FINALS END</p>`;
  
  // The contest is done
  } else {
    timer.innerHTML = `
      <h4 style="margin-bottom: 24px; margin-top: 8px;">${displayTime(now - contest_finals_end)}</h4>
      <p class="timer-label">SINCE THE CONTEST ENDED</p>`;
  }
}

updateInterval();
setInterval(updateInterval, 1000);