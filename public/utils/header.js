// Loads user data from the server
const DATA = { userData: { lastSubmit: localStorage.getItem('then'), }, problems: [], autocomplete: [], submissions: [] };
localStorage.setItem('location', location.href);

const loadUserData = () => {
  createXHR('./user/data', 'POST', {}, data => {
    DATA.userData.username = data.username;
    DATA.userData.lastSubmit = data.lastSubmit || 0;
  });
}