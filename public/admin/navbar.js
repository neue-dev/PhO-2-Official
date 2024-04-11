const navbar = document.querySelectorAll('nav')[0];
const navbarTitleDesktop = document.querySelector('#navbar-title-desktop');
const navbarTitleMobile = document.querySelector('#navbar-title-mobile');

navbar.className = 'hellyeahimanadminmf';
navbarTitleDesktop.innerHTML += ' <span class="admin-label"> - admin</span>';
navbarTitleMobile.innerHTML += ' <span class="admin-label"> - admin</span>';

setTimeout(() => {
  const navbarTitleTeam = document.getElementById("navbar-title-team");
  const navbarTitleCat = document.getElementById("navbar-title-cat");

  createXHR('./user/data', 'POST', {}, data => {
    DATA.userData.username = data.username;
    DATA.userData.category = data.category;
  
    localStorage.setItem('username', DATA.userData.username);
    localStorage.setItem('category', DATA.userData.category);
  
    navbarTitleTeam.textContent = `welcome, ${data.username}!`;
  });
}, 500);