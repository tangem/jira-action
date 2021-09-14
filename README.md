# `jira-action` GitHub Action

## Table of Contents

* [Usage](#usage)
* [Inputs](#inputs)

## Usage

```yaml
- name: commit-list-action
  uses: tangem/jira-action@master
    with:
      github-token: ${{secrets.TOKEN}}
      github-email: ${{secrets.JIRA_EMAIL}}
      github-user: ${{secrets.JIRA_USER}}
      jira-token: ${{secrets.JIRA_TOKEN}}
      jira-user: ${{secrets.JIRA_USER}}
      jira-domain: 'tangem'        
      project-name: 'MM'
      release-version: '1.0.0'
      pull-number: 1
      release-file-path: 'releases'
      release-file-prefix: 'version_'    

```

## Inputs

| Name          | Requirement | Default | Description |
| ------------- | ----------- | ------- | ----------- |
| `github-token`       | _required_ | | Token for access to GitHub |
| `github-email`       | _required_ | | Email of GitHub User for creating a commit |
| `github-user`        | _optional_ | | GitHub User for creating a commit |
| `jira-token`         | _required_ | | Token for access to Jira |
| `jira-user`          | _required_ | | The user of Jira |
| `jira-domain`        | _required_ | | The domain of Jira |
| `project-name`       | _required_ | | Alias of the project in the Jira |
| `release-version`    | _required_ | | Name of version |
| `pull-number`        | _required_ | | Number of pull request |
| `release-file-path`  | _optional_ | | The path to file with version changing |
| `release-file-prefix`| _optional_ | `Changelog_` | The prefix of file with version changing |
