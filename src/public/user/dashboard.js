const problem_table = document.querySelectorAll('.problem-table')[0];
const submission_table = document.querySelectorAll('.submission-table')[0];
filterFunc([problem_table, submission_table]);

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

      if(!DATA.submissions.filter(submission => submission.name == problem.name && submission.verdict == 'correct').length)
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
  if(!answer.toLowerCase().match(REGEX.ANSWER) || !answer.length)
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

      // Clear the values first
      submitProblem.value = '';
      submitAnswer.value = '';
      
      // Update display
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
    problem_code.innerHTML = `<div>[ ${problem.code.number + problem.code.alpha} ]</div>`;
    problem_points.innerHTML = `<div>${problem.points} ${problem.points == 1 ? 'pt' : 'pts'}</div>`;
    problem_attempts.innerHTML = `<div>${problem.attempts} attempt${problem.attempts == 1 ? '' : 's'}</div>`;
    problem_verdict.innerHTML = 
      problem.verdict == 'correct' ? '<b class="">correct</b>' : 
      problem.verdict == 'wrong' ? '<b class="red-text">wrong</b>' : `<div>${problem.verdict}</div>`;
    
    problem_code.style.width = '50px';
    problem_name.style.width = '400px';

    if(problem.verdict == 'correct'){
      problem_element.className = 'selected-tr';
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
      let problemName = submission.problemCodeName.replace(
        submission.problemCodeName.split(' ')[0], '').trim();
      let problemCode = submission.problemCodeName.split(' ')[0].trim();

      DATA.problems.forEach(problem => {
        if(!problem.attempts) 
          problem.attempts = 0;
        if(problem.name == problemName){
          problem.attempts++;
        if(submission.verdict == 'correct') 
          problem.verdict = 'correct';
        }
      });

      DATA.submissions.push(submission);

      let indexToDelete;
      if(DATA.autocomplete.filter(entry => entry.split(' ')[0] == problemCode && submission.verdict == 'correct').length) {
        DATA.autocomplete.forEach(entry => {
          if(entry.split(' ')[0] == problemCode) 
            indexToDelete = DATA.autocomplete.indexOf(entry)
        })

        DATA.autocomplete.splice(indexToDelete, 1);
      }
    });

    let problem_dict = {}; DATA.autocomplete.forEach(problem => problem_dict[problem] = null);
    M.Autocomplete.init(document.querySelectorAll('.autocomplete'), {
      data: problem_dict,
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
    
    submission_problem.innerHTML = `<div>${submission.problemCodeName.split(' ')[0]} - <b>${submission.problemCodeName.replace(submission.problemCodeName.split(' ')[0], '')}</b></div>`;
    submission_answer.innerHTML = `<div>answer: <b>${submission.answer.mantissa} ${submission.answer.exponent != 0 ? '&#215; 10<sup>' + submission.answer.exponent + '</sup>' : ''}</b></div>`;
    submission_verdict.innerHTML = submission.verdict == 'correct' ? `<b class="">correct</b>` : `<b class="red-text">wrong</b>`;
    submission_timestamp.innerHTML = `<div>${timestamp.split(' GMT')[0].replace(timestamp.split(' GMT')[0].split(' ')[0], '')}</div>`;
    
    submission_problem.style.width = '250px';
    if(submission.verdict == 'correct'){
      submission_element.className = 'selected-tr';
    }

    submission_element.appendChild(submission_problem);
    submission_element.appendChild(submission_answer);
    submission_element.appendChild(submission_verdict);
    submission_element.appendChild(submission_timestamp);
    submission_table.appendChild(submission_element);
  })
};

// Cooldown client implementation
const submitAnswerContent = document.getElementsByClassName('submit-answer-content')[0];
const submitAnswerCooldown = document.getElementsByClassName('submit-answer-cooldown')[0];
const cooldown = document.getElementsByClassName('cooldown')[0];
const cooldownInterval = () => {
  localStorage.setItem('submitThen', DATA.userData.lastSubmit);
  localStorage.setItem('messageThen', DATA.userData.lastMessage);

  let submissionInterval = parseInt(localStorage.getItem('SUBMISSION_COOLDOWN')) - (parseInt(Date.now()) - localStorage.getItem('submitThen'));
  let messageInterval = parseInt(localStorage.getItem('MESSAGE_COOLDOWN')) - (parseInt(Date.now()) - localStorage.getItem('messageThen'));

  submitAnswerContent.hidden = true;
  submitAnswerCooldown.hidden = false;

  if(submissionInterval < 0) {
    submitAnswerContent.hidden = false;
    submitAnswerCooldown.hidden = true;  
    submissionInterval = 0
  };

  let minutes = Math.floor(submissionInterval / 1000 / 60);
  let seconds = Math.floor(submissionInterval / 1000) % 60;
  cooldown.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

cooldownInterval();
setInterval(cooldownInterval, 1000);