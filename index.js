const core = require('@actions/core');

const CHECK_VERSION_ACTION = 'checkVersion';
const CREATE_VERSION_ACTION = 'createVersion';
const SET_VERSION_TO_ISSUES_ACTION = 'setVersionToIssues';
const RENAME_VERSION_ACTION = 'renameVersion';
const GET_BRANCH_SUMMARY_ACTION = 'getBranchSummary';

const Jira = require('./jira');
const { debug } = require('@actions/core');

async function run() {
  const { getInput, setFailed, setOutput } = core;

  try {
    const action = getInput('action', { required: true }).trim();

    const project = getInput(
      'project',
      // eslint-disable-next-line max-len
      { required: [CHECK_VERSION_ACTION, CREATE_VERSION_ACTION, RENAME_VERSION_ACTION, SET_VERSION_TO_ISSUES_ACTION].includes(action) },
    );
    const version = getInput(
      'version',
      // eslint-disable-next-line max-len
      { required: [CHECK_VERSION_ACTION, CREATE_VERSION_ACTION, RENAME_VERSION_ACTION, SET_VERSION_TO_ISSUES_ACTION].includes(action) },
    );
    const issues = getInput(
      'issues',
      { required: [SET_VERSION_TO_ISSUES_ACTION].includes(action) },
    );
    const newName = getInput(
      'new-name',
      { required: [RENAME_VERSION_ACTION].includes(action) },
    );
    const branch = getInput(
      'branch-name',
      { required: [GET_BRANCH_SUMMARY_ACTION].includes(action) },
    );

    const {
      checkVersion, createVersion, setVersionToIssues, renameVersion, getBranchSummary,
    } = new Jira();

    const actions = {
      [CHECK_VERSION_ACTION]: () => checkVersion(project, version),
      [CREATE_VERSION_ACTION]: () => createVersion(project, version),
      [RENAME_VERSION_ACTION]: () => renameVersion(project, version, newName),
      [SET_VERSION_TO_ISSUES_ACTION]: () => setVersionToIssues(project, version, issues),
      [GET_BRANCH_SUMMARY_ACTION]: () => getBranchSummary(branch),
    };

    if (!Object.prototype.hasOwnProperty.call(actions, action)) {
      setFailed('You must use valid action');
      process.exit(1);
    }

    const result = await actions[action]();

    debug(`result is ${result}`);
    if (typeof result === 'object') {
      debug('result is object');
      Object.entries(result).forEach(([key, value]) => {
        debug(`key: ${key} value:${value}`);
        setOutput(key, value);
      });
    } else {
      debug(`2result is ${result}`);
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
