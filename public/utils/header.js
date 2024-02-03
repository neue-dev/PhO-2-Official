// Loads user data from the server
const DATA = { 
  userData: { 
    lastSubmit: localStorage.getItem('submitThen'),
    lastMessage: localStorage.getItem('messageThen') 
  }, users: [], problems: [], autocomplete: [], submissions: [] 
};

const loadUserData = () => {
  createXHR('./user/data', 'POST', {}, data => {
    DATA.userData.username = data.username;
    DATA.userData.lastSubmit = data.lastSubmit || 0;
    DATA.userData.lastMessage = data.lastMessage || 0;
  });
}