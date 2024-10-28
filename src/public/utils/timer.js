/**
 * @ Author: Mo David
 * @ Create Time: 2024-02-07 17:54:56
 * @ Modified time: 2024-10-28 11:38:37
 * @ Description:
 * 
 * Handles the displayed timer on the dashboard.
 * 
 * // ! todo: refactor this so it has less lines + doesn't pollute the global scope.
 */

const timer = document.getElementsByClassName('timer')[0];

// Timer update
setInterval(() => {

  // Build the time
  const t= PHO2.time();
  const {
    seconds, minutes, hours, days
  } = t.time;
  
  // The styles for each tag
  const text_style = {
    display: 'inline-block',
    fontFamily: 'monospace',
    opacity: 1,
  };
  const label_style = {
    display: 'inline-block',
    fontSize: '0.5em',
    opacity: 0.6,
  };
  const suffix_style = {
    display: 'inline-block',
    fontSize: '0.5em',
    opacity: 1.0,
  };

  // The different span tags
  const s = PHO2.span(seconds, text_style);
  const m = PHO2.span(minutes, text_style);
  const h = PHO2.span(hours, text_style);
  const d = PHO2.span(days, text_style);

  // Labels
  const sl = PHO2.span('secs', label_style)
  const ml = PHO2.span('mins', label_style)
  const hl = PHO2.span('hours', label_style)
  const dl = PHO2.span('days', label_style)

  // Suffix
  let suffix = PHO2.span(t.suffix, { ...suffix_style, fontStyle: 'italic', fontSize: '1em' });
  suffix = PHO2.span(`—  ${suffix.outerHTML}`, { ...suffix_style, opacity: 0.25 });

  // Update timer content
  timer.innerHTML = 
    `${d.outerHTML} ${dl.outerHTML} ${h.outerHTML} ${hl.outerHTML} ` +
    `${m.outerHTML} ${ml.outerHTML} ${s.outerHTML} ${sl.outerHTML} ${suffix.outerHTML}`

}, 1000)