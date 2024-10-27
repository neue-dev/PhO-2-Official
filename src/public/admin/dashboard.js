const config_table = document.querySelectorAll('.config-table')[0];
const user_table = document.querySelectorAll('.user-table')[0];
const problem_table = document.querySelectorAll('.problem-table')[0];
filterFunc([config_table, user_table, problem_table]);

// Some preloading sht
document.addEventListener('DOMContentLoaded', function() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  M.Modal.init(document.querySelectorAll('.modal'), {});
  M.FormSelect.init(document.querySelectorAll('select'), {});
  M.Tabs.init(document.querySelectorAll('.dashboard-tabs'), {});
  
  loadConfig();
  loadUsers();
  loadProblems();
});

const editConfigModal = document.querySelectorAll('.edit-config-modal')[0];
const editConfigButton = document.querySelectorAll('.edit-config-button')[0];
const editKey = document.querySelector('#edit-config-key');
const editValue = document.querySelector('#edit-config-value');

editConfigButton.addEventListener('click', e => {
  if(!editKey.textContent) {
    return M.toast({html: 'No selected config parameter.'});
  }

  // Edit user request
  createXHR('./admin/editconfig', 'POST',
  {
    key: editKey.textContent,
    value: (function() {
      switch(editValue.type) {
        case 'datetime-local':
          return (new Date(editValue.value)).getTime();
        default:
          return editValue.value || ''; 
      }
    })(),
  },
  () => {
    editValue.value = '';
    loadConfig();
    M.Modal.getInstance(editConfigModal).close();
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
const enableOfficialModal = document.querySelectorAll('.enable-official-modal')[0];
const enableOfficialButton = document.querySelectorAll('.enable-official-button')[0];
const disableOfficialModal = document.querySelectorAll('.disable-official-modal')[0];
const disableOfficialButton = document.querySelectorAll('.disable-official-button')[0];
const problemName = document.querySelector('#name');
const code = document.querySelector('#code');
const answer = document.querySelector('#answer');
const tolerance = document.querySelector('#tolerance');
const points = document.querySelector('#points');

const editProblemModal = document.querySelectorAll('.edit-problem-modal')[0];
const editProblemButton = document.querySelectorAll('.edit-problem-button')[0];
const editProblemName = document.querySelector('#edit-problem-name');
const editProblemType = document.querySelector('#edit-problem-type');
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

enableOfficialButton.addEventListener('click', e => {

  // Make request to register problem
  createXHR('./admin/enableofficial', 'POST',
    {},
    () => {
      loadProblems();
      M.Modal.getInstance(enableOfficialModal).close();
    });
});

disableOfficialButton.addEventListener('click', e => {

  // Make request to register problem
  createXHR('./admin/disableofficial', 'POST',
    {},
    () => {
      loadProblems();
      M.Modal.getInstance(disableOfficialModal).close();
    });
});

editProblemButton.addEventListener('click', e => {
  if(!editProblemName.textContent) {
    return M.toast({html: 'No selected user.'});
  }

  editProblemName.textContent = editProblemName.textContent.trim();
  editProblemType.value = editProblemType.value.trim();
  editProblemCode.value = editProblemCode.value.trim();
  editProblemAnswer.value = editProblemAnswer.value.trim();
  editProblemTolerance.value = editProblemTolerance.value.trim();
  editProblemStatus.value = editProblemStatus.value.trim();
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
  let payload = { name: editProblemName.textContent };
  if(editProblemType.value != '') payload['type'] = editProblemType.value;
  if(editProblemCode.value != '') payload['code'] = codeValue;
  if(editProblemAnswer.value != '') payload['answer'] = answerValue;
  if(editProblemTolerance.value != '') payload['tolerance'] = editProblemTolerance.value;
  if(editProblemStatus.value != '') payload['status'] = editProblemStatus.value;
  if(editProblemPoints.value != '') payload['points'] = editProblemPoints.value;

  // Request to edit problem
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
const loadConfig = () => {
  createXHR('./admin/configlist', 'POST', {}, data => {
    DATA.config = [];
    data.config.forEach(configParameter => DATA.config.push(configParameter));
    displayConfig(config_table);
  });
}

const displayConfig = config_table => {
  config_table.innerHTML = '';

  DATA.config.forEach(configParameter => {
    let config_element = document.createElement('tr');
    let config_key = document.createElement('td');
    let config_value = document.createElement('td');
    let config_actions = document.createElement('td');

    config_key.style.width = '256px';
    config_value.style.width = '256px';

    config_key.innerHTML = `<b>${configParameter.key}</b>`;
    config_value.innerHTML = `${(function(){
      switch(configParameter.type) {
        case 'date':
          return `<div>${(new Date(parseInt(configParameter.value))).toString().split(' ').slice(1, 5).join(' ')}
            <br><span style="opacity: 0.4; font-size: 0.67em;">[<i>${configParameter.value}</i>]</span></div>`;
        case 'url':
          return `<a href="${configParameter.value}" target="_blank">${configParameter.key} 
            <br><span style="opacity: 0.4; font-size: 0.67em;">[<i>${configParameter.value}</i>]</span></a>`;
        case 'duration':
          return `<div>${Math.floor(configParameter.value / 1000 / 60)}m ${Math.floor(configParameter.value) / 1000 % 60}s
            <br><span style="opacity: 0.4; font-size: 0.67em;">[<i>${configParameter.value}</i>]</span></div>`;
        default:
          editValue.type = 'text';
          return configParameter.value;
      }
    })()}`;

    let editConfig = document.querySelector('#edit-config');
    config_actions.innerHTML = '<a class="waves-effect table-btn btn modal-trigger ui-text" href="#edit-config">edit</a>';
    config_actions.addEventListener('click', e => (editConfig.children[0].children[0].innerHTML = 
      `Edit parameter - <span class="red-text text-lighten-1">${configParameter.key}</span>`) && 
      (editKey.textContent = configParameter.key) &&
      (editValue.type = (function() {
        switch(configParameter.type) {
          case 'date': return 'datetime-local';
          case 'url': return 'url';
          default: return 'text';
        }
      })()));

    config_element.appendChild(config_key);
    config_element.appendChild(config_value);
    config_element.appendChild(config_actions);
    config_table.appendChild(config_element);
  });
}

const loadUsers = () => {
  createXHR('./admin/userlist', 'POST', {}, data => {
    DATA.users = [];
    data.users.sort((a, b) => a.username.localeCompare(b.username));
    data.users.forEach(user => DATA.users.push(user));
    displayUsers(user_table);
  });
}

const displayUsers = user_table => {
  user_table.innerHTML = '';

  DATA.users.forEach(user => {
    let user_element = document.createElement('tr');
    let user_username = document.createElement('td');
    let user_status = document.createElement('td');
    let user_score = document.createElement('td');
    let user_actions = document.createElement('td');
    let user_delete = document.createElement('td');

    // Set the content
    user_username.innerHTML = `<div><b>${user.username}</b>
      <br><span style="opacity: 0.4; font-size: 0.67em;">[<i>${user.category}</i>]</span></div>`;
    user_status.innerHTML = 
      user.isAdmin ? '<b class="red-text">admin</b>' : (
      user.status == 'disqualified' ? '<b class="grey-text text-darken-2">disqualified</b>' : 
      user.status == 'participating' ? '<b class="">participating</b>' : `<div>${user.status}</div>`);
    user_score.innerHTML = `<div>${(Math.round(user.score * 1000) / 1000).toString() || '-'}</div>`;
    user_actions.innerHTML = '<a class="waves-effect btn table-btn modal-trigger ui-text" href="#edit-user">edit</a>';
    user_delete.innerHTML = user.isAdmin ? '<div class="table-btn" hidden></div>' :
      `<a class="waves-effect waves-red btn table-btn modal-trigger ui-text" href="#delete-user">
        <img src="../resources/icons/trash-icon.png" width="25px" style="margin-top: 5px; opacity: 1;">
      </a>`;

    let editUser = document.querySelector('#edit-user');
    let deleteUser = document.querySelector('#delete-user');

    user_actions.addEventListener('click', e => (editUser.children[0].children[0].innerHTML = 
      `Edit user - <span class="red-text text-lighten-1">${user.username}</span>`) && (editUsername.textContent = user.username));
    user_delete.addEventListener('click', e => (deleteUser.children[0].children[0].innerHTML = 
      `Delete user - <span class="red-text text-lighten-1">${user.username}</span>`) && (deleteUsername.textContent = user.username));

    if(user.isAdmin){
      user_element.className = 'selected-tr red lighten-4';
    } else {
      if(user.status == 'disqualified') {
        user_element.className = 'selected-tr grey lighten-2';
      }
    }

    user_element.appendChild(user_username);
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
    let problem_points = document.createElement('td');
    let problem_status = document.createElement('td');
    let problem_actions = document.createElement('td');
    let problem_recheck = document.createElement('td');
    let problem_delete = document.createElement('td');

    problem_name.innerHTML = `<div><b>${problem.name}</b>
      <br><span style="${problem.type == 'debug' ? 'color: #2962ff;' : ''} opacity: 0.4; font-size: 0.67em;">[<i>${problem.type}</i>]</span></div>`;
    problem_code.innerHTML = `<div>[ ${problem.code.number + problem.code.alpha} ]</div>`;
    problem_answer.innerHTML = `<div> ${problem.answer.mantissa} ${problem.answer.exponent != 0 ? '&#215; 10<sup>' + problem.answer.exponent + '</sup>' : ''}
      <br><span style="opacity: 0.4; font-size: 0.67em;">[<i>${problem.tolerance * 100}%</i>]</span></div>`;
    problem_points.innerHTML = `<div>${problem.points + (problem.points == 1 ? ' pt' : ' pts')}</div>`;
    problem_status.innerHTML = 
      problem.status == 'disabled' ? '<b class="grey-text text-darken-2">disabled</b>' : 
      problem.status == 'active' ? '<b class="">active</b>' : `<div>problem.status</div>`;
    problem_actions.innerHTML = '<a class="waves-effect btn table-btn modal-trigger ui-text" href="#edit-problem">edit</a>';
    problem_recheck.innerHTML = '<a class="waves-effect btn table-btn modal-trigger ui-text" href="#recheck-problem">recheck</a>';
    problem_delete.innerHTML = 
      `<a class="waves-effect waves-red btn table-btn modal-trigger text-darken-3 ui-text" href="#delete-problem">
      <img src="../resources/icons/trash-icon.png" width="25px" style="margin-top: 5px; opacity: 1;">
      </a>`;

    let editProblem = document.querySelector('#edit-problem');
    let recheckProblem = document.querySelector('#recheck-problem');
    let deleteProblem = document.querySelector('#delete-problem');
    
    problem_actions.addEventListener('click', e => (editProblem.children[0].children[0].innerHTML = 
      `Edit problem - <span class="red-text text-lighten-1">${problem.name}</span>`) && (editProblemName.textContent = problem.name));
    problem_recheck.addEventListener('click', e => (recheckProblem.children[0].children[0].innerHTML = 
      `Recheck problem - <span class="red-text text-lighten-1">${problem.name}</span>`) && (recheckProblemname.textContent = problem.name));
    problem_delete.addEventListener('click', e => (deleteProblem.children[0].children[0].innerHTML = 
      `Delete problem - <span class="red-text text-lighten-1">${problem.name}</span>`) && (deleteProblemname.textContent = problem.name));

    problem_code.style.width = '64px';
    problem_name.style.width = '200px';
    if(problem.status == 'disabled'){
      problem_element.className = 'selected-tr grey lighten-2';
    }

    problem_element.appendChild(problem_code);
    problem_element.appendChild(problem_name);
    problem_element.appendChild(problem_answer);
    problem_element.appendChild(problem_points);
    problem_element.appendChild(problem_status);
    problem_element.appendChild(problem_actions);
    problem_element.appendChild(problem_recheck);
    problem_element.appendChild(problem_delete);
    problem_table.appendChild(problem_element);
  })
}