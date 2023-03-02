const core = require('@actions/core');

const CHECK_VERSION_ACTION = 'checkVersion';
const CREATE_VERSION_ACTION = 'createVersion';
const REALISE_VERSION_ACTION = 'realiseVersion';
const SET_VERSION_TO_ISSUES_ACTION = 'setVersionToIssues';
const RENAME_VERSION_ACTION = 'renameVersion';
const GET_BRANCH_SUMMARY_ACTION = 'getBranchSummary';
const GET_ISSUES_SUMMARY_ACTION = 'getIssuesSummary';

const Jira = require('./jira');

async function run() {
  const { getInput, setFailed, setOutput } = core;

  try {
    const action = getInput('action', { required: true }).trim();

    const project = getInput(
      'project',
      {
        required: [
          CHECK_VERSION_ACTION,
          CREATE_VERSION_ACTION,
          RENAME_VERSION_ACTION,
          SET_VERSION_TO_ISSUES_ACTION,
          REALISE_VERSION_ACTION,
        ].includes(action),
      },
    );
    const version = getInput(
      'version',
      {
        required: [
          CHECK_VERSION_ACTION,
          CREATE_VERSION_ACTION,
          RENAME_VERSION_ACTION,
          SET_VERSION_TO_ISSUES_ACTION,
          REALISE_VERSION_ACTION,
        ].includes(action),
      },
    );
    const issues = getInput(
      'issues',
      {
        required: [
          SET_VERSION_TO_ISSUES_ACTION,
          GET_ISSUES_SUMMARY_ACTION,
        ].includes(action),
      },
    );
    const newName = getInput(
      'new-name',
      { required: [RENAME_VERSION_ACTION].includes(action) },
    );
    const branch = getInput(
      'branch-name',
      { required: [GET_BRANCH_SUMMARY_ACTION].includes(action) },
    );

    const jira = new Jira();

    const actions = {
      [CHECK_VERSION_ACTION]: () => jira.checkVersion(project, version),
      [CREATE_VERSION_ACTION]: () => jira.createVersion(project, version),
      [REALISE_VERSION_ACTION]: () => jira.realiseVersion(project, version),
      [RENAME_VERSION_ACTION]: () => jira.renameVersion(project, version, newName),
      [SET_VERSION_TO_ISSUES_ACTION]: () => jira.setVersionToIssues(project, version, issues),
      [GET_BRANCH_SUMMARY_ACTION]: () => jira.getBranchSummary(branch),
      [GET_ISSUES_SUMMARY_ACTION]: () => jira.getIssuesSummary(issues),
    };

    if (!Object.prototype.hasOwnProperty.call(actions, action)) {
      setFailed('You must use valid action');
      process.exit(1);
    }

    const result = await actions[action]();
    if (typeof result === 'object') {
      Object.entries(result).forEach(([key, value]) => {
        setOutput(key, value);
      });
    } else {
      setOutput('result', result);
    }

    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
}

run();
