// Announcement form
const announcementViewModal = document.querySelector('#view-announcement');
const view_title = document.querySelectorAll('#view-announcement .title-text')[0];
const view_content = document.querySelectorAll('#view-announcement p')[0];

// Tables
const announcements_table = document.querySelectorAll(".announcements-table")[0];
filterFunc([announcements_table]);

document.addEventListener('DOMContentLoaded', function() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  M.Modal.init(document.querySelectorAll('.modal'), {});
  M.Tabs.init(document.querySelectorAll('.forum-tabs'), {});

  loadAnnouncements();
  // loadClarifications();
});

const loadAnnouncements = () => {
  createXHR('./user/announcementlist', 'POST', {}, data => {
    DATA.announcements = [];
    data.announcements.forEach(announcement => {
      DATA.announcements.push(announcement);
    });

    // Sort by latest
    DATA.announcements.sort((a, b) => b.timestamp - a.timestamp);
    displayForum(announcements_table);
  });
}

const displayForum = (announcements_table) => {
  announcements_table.innerHTML = '';

  DATA.announcements.forEach(announcement => {
    let announcement_element = document.createElement('tr');
    let announcement_title = document.createElement('td');
    let announcement_timestamp = document.createElement('td');
    let announcement_view = document.createElement('td');
    
    // Set the content
    let timestamp = new Date(parseInt(announcement.timestamp));
    announcement_title.innerHTML = `<b>${announcement.title}</b>`;
    announcement_timestamp.innerHTML = ` 
      <div>
        <b style="opacity: 0.8;">${timestamp.getHours()}:${(timestamp.getMinutes() < 10 ? '0' : '') + timestamp.getMinutes()}</b>
        <br><span style="font-size: 0.8em; opacity: 0.5;">[ ${timestamp.toLocaleDateString()} ]</span>
      </div>`;
    announcement_view.innerHTML = '<a class="waves-effect btn table-btn modal-trigger ui-text" href="#view-announcement">Open</a>';
    
    // Button event listeners
    announcement_view.addEventListener('click', e => {
      view_title.textContent = announcement.title;
      view_content.innerHTML = announcement.content;
    });
    
    // Add to DOM
    announcement_element.appendChild(announcement_title);
    announcement_element.appendChild(announcement_timestamp);
    announcement_element.appendChild(announcement_view);
    announcements_table.appendChild(announcement_element);
  });
}