const JiraApi = require('./jiraApi');
const {
  getBranchId,
  getParsedIssues,
} = require('./utils');

class Jira {
  #api;

  #checkResult;

  constructor() {
    this.#api = new JiraApi();
    // eslint-disable-next-line max-len
    this.#checkResult = ({ errors = {}, errorMessages = [] }) => errorMessages.length === 0 && Object.keys(errors).length === 0;
  }

  getIssues = async (arr) => {
    const [types, ...issues] = await Promise.all([
      this.#api.getIssueType(),
      ...arr.map(async (item) => this.#api.getIssue(item)),
    ]);

    const sortArray = ['Bug', 'Improvement', 'New feature'];

    return issues
      .map((item) => ({
        ...item,
        issueType: types.get(item.issueTypeId).name,
      //  url: `${this.#baseUrl}/browse/${item.key}`,
      }))
      .filter((item) => item.issueType.toLowerCase() !== 'bug' || !item.existFixVersions)
      .sort((a, b) => sortArray.indexOf(b.issueType) - sortArray.indexOf(a.issueType));
  };

  setVersionToIssues = async (projectName, versionName, issuesString) => {
    const issues = getParsedIssues(issuesString);

    if (!Array.isArray(issues) || !issues.length) {
      return false;
    }

    const { id } = await this.#api.findProjectVersionByName(projectName, versionName);

    if (!id) {
      return false;
    }
    const result = await Promise.all(
      issues.map((issue) => this.#api.issueSetVersion(issue, id)),
    );

    return result.map((item) => this.#checkResult(item)).find((item) => !item) === undefined;
  };

  checkVersion = async (projectName, version) => {
    const result = await this.#api.findProjectVersionByName(projectName, version);
    const wasFound = (result !== undefined);
    // eslint-disable-next-line no-console
    console.log(`Version ${version} in project ${projectName} ${wasFound ? 'was found' : 'was not found'}`);
    return wasFound;
  };

  createVersion = async (projectName, version) => {
    const projectId = await this.#api.getProjectId(projectName);
    const wasCreated = this.#checkResult(await this.#api.createVersion(projectId, version));
    // eslint-disable-next-line no-console
    console.log(`Version ${version} in project ${projectName} ${wasCreated ? 'was created' : 'was not created'}`);
    return wasCreated;
  };

  renameVersion = async (projectName, oldName, newName) => {
    if (!newName) {
      return false;
    }
    const version = await this.#api.findProjectVersionByName(projectName, oldName);
    if (!version) {
      return false;
    }
    const result = await this.#api.renameVersion(version.id, newName);

    return this.#checkResult(result);
  };

  getBranchSummary = async (name) => {
    const id = getBranchId(name);
    if (!id) {
      return false;
    }

    try {
      const { summary, key } = await this.#api.getIssue(id);
      return { key, summary };
    } catch (e) {
      return false;
    }
  };

  realiseVersion = async (projectName, versionName) => {
    const version = await this.#api.findProjectVersionByName(projectName, versionName);
    if (!version) {
      return false;
    }
    const result = await this.#api.realiseVersion(version.id);

    return this.#checkResult(result);
  };

  getIssuesSummary = async (issuesString) => {
    const issues = getParsedIssues(issuesString);

    if (!Array.isArray(issues) || !issues.length) {
      return false;
    }

    return (await Promise.all(
      issues.map(async (id) => {
        const {
          summary,
          key,
        } = await this.#api.getIssue(id);
        return `${key} ${summary}`;
      }),
    )).join('\n');
  };
}

module.exports = Jira;
