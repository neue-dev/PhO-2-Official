const DATA = { users: [], problems: [] };
const user_table = document.querySelectorAll('.user-table')[0];
const problem_table = document.querySelectorAll('.problem-table')[0];

// Some preloading sht
document.addEventListener('DOMContentLoaded', function() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  M.Modal.init(document.querySelectorAll('.modal'), {});
  M.FormSelect.init(document.querySelectorAll('select'), {});
  M.Tabs.init(document.querySelectorAll('.dashboard-tabs'), {});
  
  loadUsers();
  loadProblems();
});

// Filter functionality
const filterText = document.querySelector('#filter-text');

// filterText.addEventListener('focusout', e => {
//   filterText.value = ''

//   let user_entries = user_table.children;
//   let problem_entries = problem_table.children;

//   for(let i = 0; i < user_entries.length; i++) user_entries[i].style.display = '';
//   for(let i = 0; i < problem_entries.length; i++) problem_entries[i].style.display = '';
// });

filterText.addEventListener('input', e => {
  let user_entries = user_table.children;
  let problem_entries = problem_table.children;

  for(let i = 0; i < user_entries.length; i++) {
    let user_entry = user_entries[i];

    if (!user_entry.children[0].children[0].textContent.toLowerCase().includes(filterText.value.toLowerCase())){
      user_entry.style.display = 'none';
    } else {
      user_entry.style.display = '';
    }
  }

  for(let i = 0; i < problem_entries.length; i++) {
    let problem_entry = problem_entries[i];

    if (!problem_entry.children[0].textContent.toLowerCase().includes(filterText.value.toLowerCase()) &&
      !problem_entry.children[1].children[0].textContent.toLowerCase().includes(filterText.value.toLowerCase())){

      problem_entry.style.display = 'none';
    } else {
      problem_entry.style.display = '';
    }
  }
});

// User handling JS
const downloadModal = document.querySelectorAll('.submission-log-modal')[0];
const downloadButton = document.querySelectorAll('.submission-log-button')[0];

const updateScoresModal = document.querySelectorAll('.update-scores-modal')[0];
const updateScoresButton = document.querySelectorAll('.update-scores-button')[0];

// Sht this actually works thanks stackoverflow
const download = (filename, text) => {

  let a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.style.display = 'none';

  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
}

downloadButton.addEventListener('click', e => {
  createXHR('./admin/submissionlog', 'POST', {}, data => {
    download('SUBMISSION_LOG - ' + (Date()).split(' ').slice(1, 5).join('_') + '.txt', (() => {
      let text = '';

      data.submissions.forEach(submission => {
        text += `${submission.username},${submission.problemCodeName},${submission.answer.mantissa}` + 
          `e${submission.answer.exponent},${submission.verdict},${submission.timestamp}\n`;
      })

      M.Modal.getInstance(downloadModal).close();
      return text;
    })());
  })
});

updateScoresButton.addEventListener('click', e => {
  createXHR('./admin/updatescores', 'POST', {}, () => {
    M.Modal.getInstance(updateScoresModal).close();
  });
});

const registerUserModal = document.querySelectorAll('.register-user-modal')[0];
const registerUserButton = document.querySelectorAll('.register-user-button')[0];
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const category = document.querySelector('#category');

const editUserModal = document.querySelectorAll('.edit-user-modal')[0];
const editUserButton = document.querySelectorAll('.edit-user-button')[0];
const editUsername = document.querySelector('#edit-username');
const editPassword = document.querySelector('#edit-user-password');
const editStatus = document.querySelector('#edit-user-status');
const editCategory = document.querySelector('#edit-user-category');

const deleteUserModal = document.querySelectorAll('.delete-user-modal')[0];
const deleteUserButton = document.querySelectorAll('.delete-user-button')[0];
const deleteUsername = document.querySelector('#delete-username');

registerUserButton.addEventListener('click', e => {

  username.value = username.value.trim();
  password.value = password.value.trim();
  category.value = category.value.trim();

  if(!username.value || !password.value || !category.value) {
    return M.toast({html: 'A field is missing a value.'});
  }

  // Register user request
  createXHR('./admin/registeruser', 'POST',
  { username: username.value, password: password.value, category: category.value },
  () => {
    loadUsers();
    M.Modal.getInstance(registerUserModal).close();
  });
});

editUserButton.addEventListener('click', e => {
  if(!editUsername.textContent) {
    return M.toast({html: 'No selected user.'});
  }

  // Edit user request
  createXHR('./admin/edituser', 'POST',
  {
    username: editUsername.textContent,
    password: editPassword.value || '',
    status: editStatus.value,
    category: editCategory.value,
  },
  () => {
    editPassword.value = '';
    loadUsers();
    M.Modal.getInstance(editUserModal).close();
  });
});

deleteUserButton.addEventListener('click', e => {
  if(!deleteUsername.textContent) {
    return M.toast({html: 'No selected user.'});
  }

  // Delete user request
  createXHR('./admin/deleteuser', 'POST',
  { username: deleteUsername.textContent },
  () => {
    loadUsers();
    M.Modal.getInstance(deleteUserModal).close();
  });
});

// Problem handling JS
const registerProblemModal = document.querySelectorAll('.register-problem-modal')[0];
const registerProblemButton = document.querySelectorAll('.register-problem-button')[0];
const problemName = document.querySelector('#name');
const code = document.querySelector('#code');
const answer = document.querySelector('#answer');
const tolerance = document.querySelector('#tolerance');
const points = document.querySelector('#points');

const editProblemModal = document.querySelectorAll('.edit-problem-modal')[0];
const editProblemButton = document.querySelectorAll('.edit-problem-button')[0];
const editProblemname = document.querySelector('#edit-problemname');
const editProblemCode = document.querySelector('#edit-problem-code');
const editProblemAnswer = document.querySelector('#edit-problem-answer');
const editProblemTolerance = document.querySelector('#edit-problem-tolerance');
const editProblemPoints = document.querySelector('#edit-problem-points');
const editProblemStatus = document.querySelector('#edit-problem-status');

const deleteProblemModal = document.querySelectorAll('.delete-problem-modal')[0];
const deleteProblemButton = document.querySelectorAll('.delete-problem-button')[0];
const deleteProblemname = document.querySelector('#delete-problemname');

const recheckProblemModal = document.querySelectorAll('.recheck-problem-modal')[0];
const recheckProblemButton = document.querySelectorAll('.recheck-problem-button')[0];
const recheckProblemname = document.querySelector('#recheck-problemname');

registerProblemButton.addEventListener('click', e => {
  if(!problemName.value || !code.value || !answer.value || !tolerance.value || !points.value) {
    return M.toast({html: 'Some values are missing.'});
  }

  problemName.value = problemName.value.trim();
  code.value = code.value.trim();
  answer.value = answer.value.trim();
  tolerance.value = tolerance.value.trim();
  points.value = points.value.trim();

  // Check validity of inputs
  if(!code.value.toLowerCase().match(REGEX.CODE))
    return M.toast({html: 'Code must be a number then a single letter.'});
  if(!answer.value.toLowerCase().match(REGEX.ANSWER))
    return M.toast({html: 'Answer is not in a valid answer format.'});
  if(!tolerance.value.match(REGEX.TOLERANCE))
    return M.toast({html: 'Tolerance must be formatted properly.'});
  if(!points.value.match(REGEX.POINTS))
    return M.toast({html: 'Problem point count must be formatted properly.'});

  const answerValue = formatAnswer(answer.value);
  const codeValue = {
    number: code.value[code.value.length - 1].match(/^[a-z]$/) ? code.value.slice(0, code.value.length - 1) : code.value, 
    alpha: code.value[code.value.length - 1].match(/^[a-z]$/) ? code.value[code.value.length - 1] : '',
  };

  // Make request to register problem
  createXHR('./admin/registerproblem', 'POST',
    {
      name: problemName.value,
      code: codeValue,
      answer: answerValue,
      tolerance: parseFloat(tolerance.value),
      points: parseInt(points.value.toString()) || 5,
    },
    () => {
      loadProblems();
      M.Modal.getInstance(registerProblemModal).close();
    });
});

editProblemButton.addEventListener('click', e => {
  if(!editProblemname.textContent) {
    return M.toast({html: 'No selected user.'});
  }

  editProblemname.textContent = editProblemname.textContent.trim();
  editProblemCode.value = editProblemCode.value.trim();
  editProblemAnswer.value = editProblemAnswer.value.trim();
  editProblemTolerance.value = editProblemTolerance.value.trim();
  editProblemPoints.value = editProblemPoints.value.trim();

  // Check validity of inputs
  if(!editProblemCode.value.toLowerCase().match(REGEX.CODE) && editProblemCode.value != '')
    return M.toast({html: 'Code must be a number then a single letter.'});
  if(!editProblemAnswer.value.toLowerCase().match(REGEX.ANSWER) && editProblemAnswer.value != '')
    return M.toast({html: 'Answer is not in a valid answer format.'});
  if(!editProblemTolerance.value.match(REGEX.TOLERANCE) && editProblemTolerance.value != '')
    return M.toast({html: 'Tolerance must be formatted properly.'});
  if(!points.value.match(REGEX.POINTS))
    return M.toast({html: 'Problem point count must be formatted properly.'});

  let answerValue = {}, codeValue = {};
  if(editProblemAnswer.value != '') answerValue = formatAnswer(editProblemAnswer.value);
  if(editProblemCode.value != '') codeValue = {
    number: editProblemCode.value[editProblemCode.value.length - 1].match(/^[a-z]$/) ? editProblemCode.value.slice(0, editProblemCode.value.length - 1) : editProblemCode.value, 
    alpha: editProblemCode.value[editProblemCode.value.length - 1].match(/^[a-z]$/) ? editProblemCode.value[editProblemCode.value.length - 1] : '',
  };

  // Set the payload
  let payload = { name: editProblemname.textContent };
  if(editProblemCode.value != '') payload['code'] = codeValue;
  if(editProblemAnswer.value != '') payload['answer'] = answerValue;
  if(editProblemTolerance.value != '') payload['tolerance'] = editProblemTolerance.value;
  if(editProblemStatus.value != '') payload['status'] = editProblemStatus.value;
  if(editProblemPoints.value != '') payload['points'] = editProblemPoints.value;

  // Request to delete problem
  createXHR('./admin/editproblem', 'POST', 
    payload, 
    () => {
      editProblemCode.value = '';
      editProblemAnswer.value = '';
      editProblemTolerance.value = '';
      loadProblems();
      M.Modal.getInstance(editProblemModal).close()
    });
});

deleteProblemButton.addEventListener('click', e => {
  if(!deleteProblemname.textContent) {
    return M.toast({html: 'No selected problem.'});
  }

  // Request to delete problem
  createXHR('./admin/deleteproblem', 'POST', 
    { name: deleteProblemname.textContent }, 
    () => {
      loadProblems();
      M.Modal.getInstance(deleteProblemModal).close()
    });
});

recheckProblemButton.addEventListener('click', e => {
  if(!recheckProblemname.textContent) {
    return M.toast({html: 'No selected problem.'});
  }

  // Request to recheck problem
  createXHR('./admin/recheckproblem', 'POST', 
    { name: recheckProblemname.textContent }, 
    () => {
      loadProblems();
      M.Modal.getInstance(recheckProblemModal).close()
    });
});

// Table loading functions
const loadUsers = () => {
  createXHR('./admin/userlist', 'POST', {}, data => {
    DATA.users = [];
    data.users.forEach(user => DATA.users.push(user));
    displayUsers(user_table);
  });
}

const displayUsers = user_table => {
  user_table.innerHTML = '';

  DATA.users.forEach(user => {
    let user_element = document.createElement('tr');
    let user_username = document.createElement('td');
    let user_isAdmin = document.createElement('td');
    let user_category = document.createElement('td');
    let user_status = document.createElement('td');
    let user_score = document.createElement('td');
    let user_actions = document.createElement('td');
    let user_delete = document.createElement('td');

    user_username.innerHTML = `<b>${user.username}</b>`;
    user_isAdmin.innerHTML = user.isAdmin ? '<b class="blue-text">admin</b>' : 'user';
    user_category.innerHTML = user.category;
    user_status.innerHTML = 
      user.status == 'disqualified' ? '<b class="blue-grey-text">disqualified</b>' : 
      user.status == 'participating' ? '<b class="green-text">participating</b>' : user.status;
    user_score.innerHTML = (Math.round(user.score * 1000) / 1000).toString() || '-';
    user_actions.innerHTML = '<a class="waves-effect btn modal-trigger white grey-text text-darken-3 ui-text" href="#edit-user">edit</a>';
    user_delete.innerHTML = user.isAdmin ? '' :
      `<a class="waves-effect btn modal-trigger red lighten-3 grey-text text-darken-3 ui-text" href="#delete-user">
        <img src="../resources/icons/trash-icon.png" width="25px" style="margin-top: 5px">
      </a>`;

    let editUser = document.querySelector('#edit-user');
    let deleteUser = document.querySelector('#delete-user');
    user_actions.addEventListener('click', e => (editUser.children[0].children[0].innerHTML = 
      `Edit User - <span class="red-text text-lighten-1">${user.username}</span>`) && (editUsername.textContent = user.username));
    user_delete.addEventListener('click', e => (deleteUser.children[0].children[0].innerHTML = 
      `Delete User - <span class="red-text text-lighten-1">${user.username}</span>`) && (deleteUsername.textContent = user.username));

    if(user.isAdmin){
      user_element.className = 'blue lighten-4';
    } else {
      if(user.status == 'disqualified') {
        user_element.className = 'blue-grey lighten-4';
      }
    }

    user_element.appendChild(user_username);
    user_element.appendChild(user_category);
    user_element.appendChild(user_isAdmin);
    user_element.appendChild(user_status);
    user_element.appendChild(user_score);
    user_element.appendChild(user_actions);
    user_element.appendChild(user_delete);
    user_table.appendChild(user_element);
  });
}

const loadProblems = () => {
  createXHR('./admin/problemlist', 'POST', {}, data => {
    DATA.problems = [];
    data.problems.forEach(problem => DATA.problems.push(problem));
    displayProblems(problem_table);
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
    let problem_answer = document.createElement('td');
    let problem_tolerance = document.createElement('td');
    let problem_points = document.createElement('td');
    let problem_status = document.createElement('td');
    let problem_actions = document.createElement('td');
    let problem_recheck = document.createElement('td');
    let problem_delete = document.createElement('td');

    problem_name.innerHTML = `<b>${problem.name}</b>`;
    problem_code.innerHTML = `[ ${problem.code.number + problem.code.alpha} ]`;
    problem_answer.innerHTML = `${problem.answer.mantissa} ${problem.answer.exponent != 0 ? '&#215; 10<sup>' + problem.answer.exponent + '</sup>' : ''}`;
    problem_tolerance.innerHTML = problem.tolerance;
    problem_tolerance.innerHTML = problem.points + (problem.points == 1 ? ' pt' : ' pts');
    problem_status.innerHTML = 
      problem.status == 'disabled' ? '<b class="blue-grey-text">disabled</b>' : 
      problem.status == 'active' ? '<b class="green-text">active</b>' : problem.status;
    problem_actions.innerHTML = '<a class="waves-effect btn modal-trigger white grey-text text-darken-3 ui-text" href="#edit-problem">edit</a>';
    problem_recheck.innerHTML = '<a class="waves-effect btn modal-trigger white grey-text text-darken-3 ui-text" href="#recheck-problem">recheck</a>';
    problem_delete.innerHTML = 
      `<a class="waves-effect btn modal-trigger red lighten-3 grey-text text-darken-3 ui-text" href="#delete-problem">
        <img src="../resources/icons/trash-icon.png" width="25px" style="margin-top: 5px">
      </a>`;

    let editProblem = document.querySelector('#edit-problem');
    let recheckProblem = document.querySelector('#recheck-problem');
    let deleteProblem = document.querySelector('#delete-problem');
    
    problem_actions.addEventListener('click', e => (editProblem.children[0].children[0].innerHTML = 
      `Edit Problem - <span class="red-text text-lighten-1">${problem.name}</span>`) && (editProblemname.textContent = problem.name));
    problem_recheck.addEventListener('click', e => (recheckProblem.children[0].children[0].innerHTML = 
      `Recheck Problem - <span class="red-text text-lighten-1">${problem.name}</span>`) && (recheckProblemname.textContent = problem.name));
    problem_delete.addEventListener('click', e => (deleteProblem.children[0].children[0].innerHTML = 
      `Delete Problem - <span class="red-text text-lighten-1">${problem.name}</span>`) && (deleteProblemname.textContent = problem.name));

    problem_code.style.width = '50px';
    problem_name.style.width = '250px';
    if(problem.status == 'disabled'){
      problem_element.className = 'blue-grey lighten-4';
    }

    problem_element.appendChild(problem_code);
    problem_element.appendChild(problem_name);
    problem_element.appendChild(problem_answer);
    problem_element.appendChild(problem_tolerance);
    problem_element.appendChild(problem_status);
    problem_element.appendChild(problem_actions);
    problem_element.appendChild(problem_recheck);
    problem_element.appendChild(problem_delete);
    problem_table.appendChild(problem_element);
  })
}

// Log out functionality
const logoutButton = document.querySelectorAll('.logout-button');
logoutButton.forEach(button => button.addEventListener('click', e => {
  createXHR('./auth/logout', 'POST', {}, () => { location.href = '/' });
}));