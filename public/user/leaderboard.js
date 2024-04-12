const overall_table = document.querySelectorAll(".overall-table")[0];
const junior_table = document.querySelectorAll(".junior-table")[0];
const senior_table = document.querySelectorAll(".senior-table")[0];
filterFunc([overall_table, junior_table, senior_table]);

document.addEventListener('DOMContentLoaded', function() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  M.Tabs.init(document.querySelectorAll('.leaderboard-tabs'), {});

  loadLeaderboard();
});

const loadLeaderboard = () => {
  createXHR('./user/problemlist', 'POST', {}, data => {
    data.problems.forEach(problem => {
      DATA.problems[problem._id] = problem;
    });

    createXHR('./user/scorelist', 'POST', {}, data => {
      data.users.forEach(user => {
        DATA.users[user._id] = {
          _id: user._id,
          username: user.username,
          category: user.category,
          score: (function(){
            let sum = 0; user.attempts.forEach(problem => {
              sum += Object.keys(DATA.problems).includes(problem) ? DATA.problems[problem].points : 0;
            });

            return sum;
          })()
        }

        // if(user.score){
        //   DATA.users[user_id].score = user.score;
        // }
      });

      displayLeaderboard(overall_table, junior_table, senior_table);
    });
  });
}

const displayLeaderboard = (overall_table, junior_table, senior_table) => {
  let userData = [];
  let overall_rank = 1, overall_index = 1, overall_pscore = Number.POSITIVE_INFINITY;
  let junior_rank = 1, junior_index = 1, junior_pscore = Number.POSITIVE_INFINITY;
  let senior_rank = 1, senior_index = 1, senior_pscore = Number.POSITIVE_INFINITY;

  Object.keys(DATA.users).forEach(user => {
    userData.push(DATA.users[user]);
  });

  userData.sort((a, b) => (function(){
    if(a.score == b.score)
      return `${a.username}`.localeCompare(b.username);
    return b.score - a.score;
  })());

  userData.forEach(user => {
    let user_data = document.createElement('tr');
    let user_rank = document.createElement('td');
    let user_name = document.createElement('td');
    let user_score = document.createElement('td');

    let user_catdata = document.createElement('tr');
    let user_catrank = document.createElement('td');
    let user_catname = document.createElement('td');
    let user_catscore = document.createElement('td');

    if(user.score < overall_pscore){
      overall_rank = overall_index;
      overall_pscore = user.score;
    }
    overall_index++;

    if(user.category == 'junior'){
      if(user.score < junior_pscore){
        junior_rank = junior_index;
        junior_pscore = user.score;
      }
      junior_index++;
    }
    
    if(user.category == 'senior'){
      if(user.score < senior_pscore){
        senior_rank = senior_index;
        senior_pscore = user.score;
      }
      senior_index++;
    }

    user_rank.innerHTML = `<div>${overall_rank + '.'}</div>`;
    user_catrank.innerHTML = `<div>${(user.category == 'junior' ? junior_rank : (user.category == 'senior' ? senior_rank : '')) + '.'}<div>`;
    user_name.innerHTML = user_catname.innerHTML = `<b>${user.username}</b>`;
    user_score.innerHTML = user_catscore.innerHTML = `<div>${user.score}</div>`;
    user_rank.style.maxWidth = user_catrank.style.maxWidth = '32px';

    user_data.appendChild(user_rank);
    user_data.appendChild(user_name);
    user_data.appendChild(user_score);
    overall_table.appendChild(user_data);

    user_catdata.appendChild(user_catrank);
    user_catdata.appendChild(user_catname);
    user_catdata.appendChild(user_catscore);

    if(user.category == 'junior')
      junior_table.appendChild(user_catdata);
    if(user.category == 'senior')
      senior_table.appendChild(user_catdata);
  })
}