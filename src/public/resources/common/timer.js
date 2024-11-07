/**
 * @ Author: Mo David
 * @ Create Time: 2024-02-07 17:54:56
 * @ Modified time: 2024-10-29 15:51:53
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
  const s = DOM.span().t(seconds).s(text_style);
  const m = DOM.span().t(minutes).s(text_style);
  const h = DOM.span().t(hours).s(text_style);
  const d = DOM.span().t(days).s(text_style);

  // Labels
  const sl = DOM.span().t('secs').s(label_style)
  const ml = DOM.span().t('mins').s(label_style)
  const hl = DOM.span().t('hours').s(label_style)
  const dl = DOM.span().t('days').s(label_style)

  // Suffix
  let suffix = DOM.span()
    .t(t.suffix)
    .s({ ...suffix_style, fontStyle: 'italic', fontSize: '1em' });
    
  suffix = DOM.span()
    .t(`—  ${suffix.t()}`) 
    .s({ ...suffix_style, opacity: 0.25 });

  // Update timer content
  timer.innerHTML = 
    `${d.t()} ${dl.t()} ${h.t()} ${hl.t()} ` +
    `${m.t()} ${ml.t()} ${s.t()} ${sl.t()} ${suffix.t()}`

}, 1000)