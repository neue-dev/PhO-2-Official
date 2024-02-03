const logoutButton = document.querySelectorAll('.logout-button');
logoutButton.forEach(button => button.addEventListener('click', e => {
  createXHR('./auth/logout', 'POST', {}, () => { location.href = '/' });
}));