const moment = require('moment');
const JiraFetch = require('./jiraFetch');

class JiraApi {
  #jiraFetch

  constructor(domain, user, token) {
    this.#jiraFetch = new JiraFetch(domain, user, token);
  }

  getIssueType = async () => {
    const response = await this.#jiraFetch.getRequest('issuetype');
    const types = new Map();
    response.forEach((item) => {
      const { untranslatedName: name } = item;
      types.set(item.id, { name });
    });
    return types;
  };

  getIssue = async (id) => {
    const { key, fields: { issuetype, summary, fixVersions } } = await this.#jiraFetch.getRequest(`issue/${id}/?fields=issuetype,summary,fixVersions`);
    return {
      key,
      summary,
      issueTypeId: issuetype.id,
      existFixVersions: fixVersions.length > 0,
    };
  };

  getProjectId = (projectName) => this.#jiraFetch.getRequest(`project/${projectName}`).then(({ id }) => id);

  findProjectVersionByName = (projectName, version) => this.#jiraFetch.getRequest(`project/${projectName}/versions`)
    .then((response) => response.find((item) => item.name === version));

  createVersion = (projectId, version) => this.#jiraFetch.setRequest('version',
    `{"archived": false,"releaseDate": "${moment().format('YYYY-MM-DD')}","name": "${version}","projectId": ${projectId},"released": true}`);

  issueSetVersion = ({ key }, { id }) => this.#jiraFetch.setRequest(`issue/${key}`,
    `{ "update": { "fixVersions": [ { "set": [ { "id": "${id}" } ] } ] } }`,
    true);
}

module.exports = JiraApi;
