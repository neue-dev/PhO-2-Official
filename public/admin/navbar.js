const navbar = document.querySelectorAll('nav')[0];
const navbarTitleDesktop = document.querySelector('#navbar-title-desktop');
const navbarTitleMobile = document.querySelector('#navbar-title-mobile');

navbar.className = 'hellyeahimanadminmf';
navbarTitleDesktop.innerHTML += ' <span class="admin-label">ADMIN</span>';
navbarTitleMobile.innerHTML += ' <span class="admin-label">ADMIN</span>';