// Configure the contest config in localStorage
document.addEventListener('DOMContentLoaded', function() {
  createXHR('./user/configlist', 'POST', {}, data => { 
    data.config.forEach(configParameter => {
      localStorage.setItem(configParameter.key, configParameter.value);
    });
  });
});