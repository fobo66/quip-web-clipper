function save_options() {
  var token = document.getElementById('token').value;
  chrome.storage.sync.set({
    accessToken: token
  }, () => {
    var status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage('optionsSaved');
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get('accessToken', (items) => {
    document.getElementById('token').value = items.accessToken;
    document.getElementById('getToken').innerHtml = chrome.i18n.getMessage('getToken');
    document.getElementById('save').innerHtml = chrome.i18n.getMessage('save');
    document.getElementById('reminderText').textContent = chrome.i18n.getMessage('accessTokenReminder');
    if (items.accessToken === 'notset' || typeof(items.accessToken) === 'undefined') {
      document.getElementById('reminder').style.display = 'block';

    }
  });
}
document.addEventListener('DOMContentLoaded',
  restore_options);

document.getElementById('getToken').addEventListener('click', () => {
  chrome.tabs.create( {
    url: 'https://quip.com/api/personal-token'
  });
});

document.getElementById('save').addEventListener('click',
  save_options);