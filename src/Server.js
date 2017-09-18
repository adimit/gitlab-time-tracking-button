/**
 * Calls the server, sending the token in the header.
 * Parses the json answer
 *
 * @param {string} url The API endpoint to call
 * @param {string} token The token
 *
 * @return {Promise} Promise containing parsed JSON response
 */
const postGitlab = (url, token) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('PRIVATE-TOKEN', token);
  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      try {
        const obj = JSON.parse(xhr.responseText);
        resolve(obj);
      } catch (e) {
        reject(e);
      }
    } else {
      reject(Error(`${xhr.status}: ${xhr.statusText}`));
    }
  };
  xhr.onerror = () => reject(Error(`Network error. ${xhr.statusText}`));
  xhr.send();
});

export default class Server {
  constructor(instanceManager) {
    this.instanceManager = instanceManager;
  }

  async record(time, location) {
    const key = this.instanceManager.getApiKey(location.instance);
    const projectId = encodeURIComponent(`${location.group}/${location.project}`);
    const apiPath = `add_spent_time?duration=${Math.floor(time)}s`;
    const url = `${location.instance}api/v4/projects/${projectId}/issues/${location.issue}/${apiPath}`;
    try {
      const response = await postGitlab(url, key);
      return { status: 'ok', totalTimeSpent: response.total_time_spent };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }
}
