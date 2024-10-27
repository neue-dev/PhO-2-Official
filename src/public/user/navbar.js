// suck you aren't an admin user

setTimeout(() => {
  const navbarTitleTeam = document.getElementById("navbar-title-team");
  const navbarTitleCat = document.getElementById("navbar-title-cat");

  createXHR('./user/data', 'POST', {}, data => {
    DATA.userData.username = data.username;
    DATA.userData.category = data.category;
  
    localStorage.setItem('username', DATA.userData.username);
    localStorage.setItem('category', DATA.userData.category);
  
    navbarTitleTeam.textContent = `welcome, ${data.username}!`;
    navbarTitleCat.textContent = ` - ${data.category} category`;
  });
}, 500);