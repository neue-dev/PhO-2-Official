// Announcement form
const announcementButton = document.querySelectorAll(".announcement-button")[0];
const announcementModal = document.querySelectorAll(".announcement-modal")[0];
const announcementViewModal = document.querySelector('#view-announcement');
const announcementDeleteModal = document.querySelector('#delete-announcement');
const announcementDeleteButton = document.querySelectorAll('.delete-announcement-button')[0];

const post_title = document.querySelector('#post-title');
const post_content = document.querySelector('#post-content');
const view_title = document.querySelectorAll('#view-announcement .title-text')[0];
const view_content = document.querySelectorAll('#view-announcement p')[0];
const delete_id = document.querySelector('#delete-announcement-id');

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
    let announcement_delete = document.createElement('td');

    // Set the content
    let timestamp = new Date(parseInt(announcement.timestamp));
    announcement_title.innerHTML = `<b>${announcement.title}</b>`;
    announcement_timestamp.innerHTML = ` 
      <div>
        <b style="opacity: 0.8;">${timestamp.getHours()}:${(timestamp.getMinutes() < 10 ? '0' : '') + timestamp.getMinutes()}</b>
        <br><span style="font-size: 0.8em; opacity: 0.5;">[ ${timestamp.toLocaleDateString()} ]</span>
      </div>`;
    announcement_view.innerHTML = '<a class="waves-effect btn table-btn modal-trigger ui-text" href="#view-announcement">Open</a>';
    announcement_delete.innerHTML = `
      <a class="waves-effect waves-red btn table-btn modal-trigger ui-text" href="#delete-announcement">
        <img src="../resources/icons/trash-icon.png" width="25px" style="margin-top: 5px; opacity: 1;">
      </a>`;

    // Button event listeners
    announcement_view.addEventListener('click', e => {
      view_title.textContent = announcement.title;
      view_content.innerHTML = announcement.content;
    });
    announcement_delete.addEventListener('click', e => (
      (announcementDeleteModal.children[0].children[0].innerHTML = `Delete Announcement - <span class="red-text text-lighten-1">${announcement.title}</span>`) &&
      (delete_id.textContent = announcement.id)
    ));

    // Add to DOM
    announcement_element.appendChild(announcement_title);
    announcement_element.appendChild(announcement_timestamp);
    announcement_element.appendChild(announcement_view);
    announcement_element.appendChild(announcement_delete);
    announcements_table.appendChild(announcement_element);
  });
}

// Create an announcement
announcementButton.addEventListener('click', e => {
  post_title.value = post_title.value.trim();
  post_content.value = post_content.value.trim();

  if(!post_title.value || !post_content.value) {
    return M.toast({html: 'A field is missing a value.'});
  }

  // Register user request
  createXHR('./admin/newannouncement', 'POST', 
    { title: post_title.value, content: post_content.value.replaceAll('\n', '<br>') },
    () => {
      loadAnnouncements();
      M.Modal.getInstance(announcementModal).close();
    }
  );
});

// Delete an announcement
announcementDeleteButton.addEventListener('click', e => {
  createXHR('./admin/deleteannouncement', 'POST', 
    { id: delete_id.textContent },
    () => {
      loadAnnouncements();
      M.Modal.getInstance(announcementDeleteModal).close();
    }
  );
});