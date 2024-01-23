const DATA = { userData: { lastSubmit: localStorage.getItem('then'), }, problems: [], autocomplete: [], submissions: [] };
const problem_table = document.querySelectorAll('.problem-table')[0];
const submission_table = document.querySelectorAll('.submission-table')[0];

// Configure some preloaders
document.addEventListener('DOMContentLoaded', function() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  M.Modal.init(document.querySelectorAll('.modal'), {});
  M.Tabs.init(document.querySelectorAll('.dashboard-tabs'), {});

  // Configure autocomplete
  createXHR('./user/problemlist', 'POST', {}, data => {
    DATA.problems = data.problems;
    DATA.autocomplete = [];

    for(let i = 0; i < DATA.problems.length; i++) {
      let problem = DATA.problems[i];
      DATA.autocomplete.push(problem.code.number + problem.code.alpha + ' ' + problem.name);
    };

    let problem_dict = {}; DATA.autocomplete.forEach(problem => problem_dict[problem] = null);
    M.Autocomplete.init(document.querySelectorAll('.autocomplete'), {
      data: problem_dict,
    });

    loadUserData();
    loadProblems();
    loadSubmissions();
  });
});

// Filter functionality
const filterText = document.querySelector('#filter-text');

// filterText.addEventListener('focusout', e => {
//   filterText.value = ''

//   let problem_entries = problem_table.children;
//   let submission_entries = submission_table.children;

//   for(let i = 0; i < problem_entries.length; i++) problem_entries[i].style.display = '';
//   for(let i = 0; i < submission_entries.length; i++) submission_entries[i].style.display = '';
// });

if(filterText) {
  filterText.addEventListener('input', e => {
    let problem_entries = problem_table.children;
    let submission_entries = submission_table.children;

    for(let i = 0; i < problem_entries.length; i++) {
      let problem_entry = problem_entries[i];

      if (!problem_entry.children[0].textContent.toLowerCase().includes(filterText.value.toLowerCase()) && 
      !problem_entry.children[1].textContent.toLowerCase().includes(filterText.value.toLowerCase())){
        problem_entry.style.display = 'none';
      } else {
        problem_entry.style.display = '';
      }
    }

    for(let i = 0; i < submission_entries.length; i++) {
      let submission_entry = submission_entries[i];

      if (!submission_entry.children[0].textContent.toLowerCase().includes(filterText.value.toLowerCase())){
        submission_entry.style.display = 'none';
      } else {
        submission_entry.style.display = '';
      }
    }
  });
}

// Submit button
const submitAnswerModal = document.querySelector('#submit-answer-modal');
const submitButton = document.querySelectorAll('.submit-button')[0];
const submitProblem = document.querySelector('#submit-problem');
const submitAnswer = document.querySelector('#submit-answer');

submitButton.addEventListener('click', e => {
  let problem = submitProblem.value.trim();
  let answer = submitAnswer.value.trim();

  if(!DATA.autocomplete.includes(problem)) 
    return M.toast({html: 'Invalid problem name.'});
  if(!answer.toLowerCase().match(REGEX.ANSWER))
    return M.toast({html: 'Answer is not in a valid answer format.'});

  const code = problem.split(' ')[0];
  const answerValue = formatAnswer(answer.toLowerCase());
  const codeValue = {
    number: code[code.length - 1].match(/^[a-z]$/) ? code.slice(0, code.length - 1) : code, 
    alpha: code[code.length - 1].match(/^[a-z]$/) ? code[code.length - 1] : '',
  };

  // Make request to submit answer
  createXHR('./user/submit', 'POST',
    {
      code: codeValue,
      answer: answerValue,
    },
    () => {
      loadUserData();
      loadSubmissions();
      M.Modal.getInstance(submitAnswerModal).close();
    });
});

// Load problem functionality
const loadProblems = () => {
  createXHR('./user/problemlist', 'POST', {}, data => {
    DATA.problems = [];
    data.problems.forEach(problem => DATA.problems.push(problem));
  });
}

const displayProblems = problem_table => {
  problem_table.innerHTML = '';

  let sortedProblems = DATA.problems;
  sortedProblems.sort((a, b) => {
    if(parseInt(a.code.number) == parseInt(b.code.number))
      return `${a.code.alpha}`.localeCompare(b.code.alpha);
    return parseInt(a.code.number) - parseInt(b.code.number);
  });

  sortedProblems.forEach(problem => {
    let problem_element = document.createElement('tr');
    let problem_name = document.createElement('td');
    let problem_code = document.createElement('td');
    let problem_points = document.createElement('td');
    let problem_attempts = document.createElement('td');
    let problem_verdict = document.createElement('td');
    
    // Define the verdict
    if(problem.verdict != 'correct'){ 
      if(problem.attempts > 0){
        problem.verdict = 'wrong';
      } else {
        problem.verdict = '-';
      }
    }

    problem_name.innerHTML = `<b>${problem.name}</b>`;
    problem_code.innerHTML = `[ ${problem.code.number + problem.code.alpha} ]`;
    problem_points.innerHTML = `${problem.points} ${problem.points == 1 ? 'pt' : 'pts'}`;
    problem_attempts.innerHTML = `${problem.attempts} attempt${problem.attempts == 1 ? '' : 's'}`;
    problem_verdict.innerHTML = 
      problem.verdict == 'correct' ? '<b class="green-text">correct</b>' : 
      problem.verdict == 'wrong' ? '<b class="red-text">wrong</b>' : problem.verdict;
    
    problem_code.style.width = '50px';
    problem_name.style.width = '400px';

    if(problem.verdict == 'correct'){
      problem_element.className = 'green lighten-4';
    }

    problem_element.appendChild(problem_code);
    problem_element.appendChild(problem_name);
    problem_element.appendChild(problem_points);
    problem_element.appendChild(problem_attempts);
    problem_element.appendChild(problem_verdict);
    problem_table.appendChild(problem_element);
  })
}

const loadSubmissions = () => {
  createXHR('./user/submissionlist', 'POST', {}, data => {
    DATA.submissions = [];
    DATA.problems.forEach(problem => (problem.attempts = 0));

    data.submissions.forEach(submission => {
      DATA.problems.forEach(problem => {
        if(!problem.attempts) 
          problem.attempts = 0;
        if(problem.name == submission.problemCodeName.replace(
          submission.problemCodeName.split(' ')[0], '').trim()){
          problem.attempts++;
        if(submission.verdict == 'correct') 
          problem.verdict = 'correct';
        }
      });
      DATA.submissions.push(submission)
    });
    
    displayProblems(problem_table);
    displaySubmissions(submission_table);
  });
};

const displaySubmissions = submission_table => {
  submission_table.innerHTML = '';

  DATA.submissions.reverse().forEach(submission => {
    let submission_element = document.createElement('tr');
    let submission_problem = document.createElement('td');
    let submission_answer = document.createElement('td');
    let submission_verdict = document.createElement('td');
    let submission_timestamp = document.createElement('td');
    let timestamp = new Date(submission.timestamp).toString();
    
    submission_problem.innerHTML = `${submission.problemCodeName.split(' ')[0]} - <b>${submission.problemCodeName.replace(submission.problemCodeName.split(' ')[0], '')}</b>`;
    submission_answer.innerHTML = `answer: <b>${submission.answer.mantissa} ${submission.answer.exponent != 0 ? '&#215; 10<sup>' + submission.answer.exponent + '</sup>' : ''}</b>`;
    submission_verdict.innerHTML = submission.verdict == 'correct' ? `<b class="green-text">correct</b>` : `<b class="red-text">wrong</b>`;
    submission_timestamp.innerHTML = `${timestamp.split(' GMT')[0].replace(timestamp.split(' GMT')[0].split(' ')[0], '')}`;
    
    submission_problem.style.width = '250px';
    if(submission.verdict == 'correct'){
      submission_element.className = 'green lighten-4';
    }

    submission_element.appendChild(submission_problem);
    submission_element.appendChild(submission_answer);
    submission_element.appendChild(submission_verdict);
    submission_element.appendChild(submission_timestamp);
    submission_table.appendChild(submission_element);
  })
};

const submitAnswerContent = document.getElementsByClassName('submit-answer-content')[0];
const submitAnswerCooldown = document.getElementsByClassName('submit-answer-cooldown')[0];
const cooldown = document.getElementsByClassName('cooldown')[0];
const timer = document.getElementsByClassName('timer')[0];

const loadUserData = () => {
  createXHR('./user/data', 'POST', {}, data => {
    DATA.userData.username = data.username;
    DATA.userData.lastSubmit = data.lastSubmit || 0;
    DATA.userData.cooldown = data.cooldown;
    DATA.userData.contestStart = data.contestStart;
    DATA.userData.contestEnd = data.contestEnd;
  });

  updateInterval();
  if(!DATA.interval){
    DATA.interval = setInterval(updateInterval, 1000);
  }
}

const updateInterval = () => {
  // Cooldown
  localStorage.setItem('then', DATA.userData.lastSubmit);
  let interval = DATA.userData.cooldown - (parseInt(Date.now()) - localStorage.getItem('then'));

  submitAnswerContent.hidden = true;
  submitAnswerCooldown.hidden = false;

  if(interval < 0) {
    submitAnswerContent.hidden = false;
    submitAnswerCooldown.hidden = true;  
    interval = 0
  };

  let minutes = Math.floor(interval / 1000 / 60);
  let seconds = Math.floor(interval / 1000) % 60;
  cooldown.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  // Timer
  let now = parseInt(Date.now());
  let start = localStorage.getItem('start') || 0;
  let end = localStorage.getItem('end') || 0;
  localStorage.setItem('start', DATA.userData.contestStart || localStorage.getItem('start'));
  localStorage.setItem('end', DATA.userData.contestEnd || localStorage.getItem('end'));

  if(!start && !end) return;

  if(now < start)
    return (interval => {timer.innerHTML = `<h2><b>
      ${Math.floor(interval / 60 / 60 / 1000)}:
      ${(Math.floor(interval / 60 / 1000) % 60 < 10 ? '0': '') + Math.floor(interval / 60 / 1000) % 60}:
      ${(Math.floor(interval / 1000) % 60 < 10 ? '0' : '') + Math.floor(interval / 1000) % 60}</b></h1><br> UNTIL CONTEST START`})(start - now);

  if(start < now && now < end)
    return (interval => {timer.innerHTML = `<h2><b>
      ${Math.floor(interval / 60 / 60 / 1000)}:
      ${(Math.floor(interval / 60 / 1000) % 60 < 10 ? '0': '') + Math.floor(interval / 60 / 1000) % 60}:
      ${(Math.floor(interval / 1000) % 60 < 10 ? '0' : '') + Math.floor(interval / 1000) % 60}</b></h1><br> UNTIL CONTEST END`})(end - now);

  return (interval => {timer.innerHTML = `<h2><b>
    ${Math.floor(interval / 60 / 60 / 1000)}:
    ${(Math.floor(interval / 60 / 1000) % 60 < 10 ? '0': '') + Math.floor(interval / 60 / 1000) % 60}:
    ${(Math.floor(interval / 1000) % 60 < 10 ? '0' : '') + Math.floor(interval / 1000) % 60}</b></h1><br> SINCE CONTEST END`})(now - end);
}

const logoutButton = document.querySelectorAll('.logout-button');
logoutButton.forEach(button => button.addEventListener('click', e => {
  createXHR('./auth/logout', 'POST', {}, () => { location.href = '/' });
}));