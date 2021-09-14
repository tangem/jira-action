const core = require('@actions/core');
const Jira = require('./jira');
const githubApi = require('./github');

async function run() {
  try {
    const { getInput } = core;
    const githubToken = getInput('github-token', { required: true });
    const githubEmail = getInput('github-email', { required: true });
    const githubUser = getInput('github-user', { required: false });
    const pullNumber = getInput('pull-number', { required: true });
    const domain = getInput('jira-domain', { required: true });
    const user = getInput('jira-user', { required: true });
    const token = getInput('jira-token', { required: true });
    const projectName = getInput('project-name', { required: true });
    const releaseVersion = getInput('release-version', { required: true });
    const releaseFilePath = getInput('release-file-path', { required: false, default: '' });
    const releaseFilePrefix = getInput('release-file-prefix', { required: false, default: 'Changelog_' });
    const defaultIssues = getInput('issues', { required: false });

    const github = githubApi(githubToken, githubEmail, githubUser, pullNumber);
    const jira = new Jira(domain, user, token, projectName);

    const issues = defaultIssues ? JSON.parse(defaultIssues) : await github.getIssues();
    const jiraIssues = await jira.getIssues(issues);

    const commentText = jiraIssues
      .map(({
        issueType, key, url, summary,
      }) => `<${issueType}>${key}(${url}) ${summary}`)
      .join('\r\n\r\n');

    const path = `${releaseFilePath}/${releaseFilePrefix}${releaseVersion}.md`;

    await Promise.all([
      github.createComment(commentText),
      github.createOrUpdateFileContents(path, releaseVersion, commentText),
      jira.setVersionToIssues(releaseVersion, jiraIssues),
    ]);
  } catch (err) {
    setFailed(err.message);
  }
}

run();
