const createXHR = (url, method, payload, callback) => {
  const xhr = new XMLHttpRequest();

  xhr.open(method, url, true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(payload));

  xhr.onreadystatechange = function () {
    if(this.readyState != 4) return;

    if(this.status == 200) {
      let data = JSON.parse(this.responseText);
      if(!data.error) {
        callback(data);
      }
      return data.message ? M.toast({ html: data.message }) : true;
    }
  };
}