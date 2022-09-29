# `jira-action` GitHub Action

## Table of Contents
* [Usage](#usage)
* [Check version](#check-version)
* [Create version](#create-version)
* [Rename version](#rename-version)
* [Set Version To Issues](#set-version-to-issues)
* [Get Branch Summary](#get-branch-summary)

## Usage

For login to Jira necessary to use 
```yaml 
- name: Jira Login
  uses: atlassian/gajira-login@master
  env:
    JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
    JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
    JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
```

The required parameter is `action` which specifies the method to use.

## Check Version
```yaml      
- name: Jira Check Version
  uses: tangem/jira-action@master
  with:
    action: checkVersion
    project: MM
    version: v1
```

### Inputs
| Name      | Requirement | Description         |
|-----------|-------------|---------------------|
| `project` | _required_  | Code of the project |
| `version` | _required_  | Name of the version |


### Outputs
| Name     | Type    | Description                             |
|----------|---------|-----------------------------------------|
| `result` | boolean | Return true if version exist in project |

## Create Version
```yaml      
- name: Jira Create Version
  uses: tangem/jira-action@master
  with:
    action: createVersion
    project: MM
    version: v1
```

### Inputs
| Name      | Requirement | Description         |
|-----------|-------------|---------------------|
| `project` | _required_  | Code of the project |
| `version` | _required_  | Name of the version |


### Outputs
| Name     | Type    | Description                        |
|----------|---------|------------------------------------|
| `result` | boolean | Return true if version was created |

## Rename Version
```yaml      
- name: Jira Rename Version
  uses: tangem/jira-action@master
  with:
    action: renameVersion
    project: MM
    version: v1
    new-name: v2
```

### Inputs
| Name       | Requirement | Description             |
|------------|-------------|-------------------------|
| `project`  | _required_  | Code of the project     |
| `version`  | _required_  | Old Name of the version |
| `new-name` | _required_  | New Name of the version |


### Outputs
| Name     | Type    | Description                        |
|----------|---------|------------------------------------|
| `result` | boolean | Return true if version was renamed |

## Set Version To Issues
```yaml      
- name: Jira Set Version To Issues
  uses: tangem/jira-action@master
  with:
    action: setVersionToIssues
    project: MM
    version: v1
```

### Inputs
| Name      | Requirement | Description                    |
|-----------|-------------|--------------------------------|
| `project` | _required_  | Code of the project            |
| `version` | _required_  | Name of the version            |
| `issues`  | _required_  | Stringify array of issues keys |


### Outputs
| Name     | Type    | Description                        |
|----------|---------|------------------------------------|
| `result` | boolean | Return true if for all set version |

## Get Branch Summary
```yaml      
- name: Jira Create Version
  uses: tangem/jira-action@master
  with:
    action: getBranchSummary
    project: MM
    version: v1
```

### Inputs
| Name          | Requirement | Description     |
|---------------|-------------|-----------------|
| `branch-name` | _required_  | The branch name |


### Outputs
| Name     | Type           | Description                                                                   |
|----------|----------------|-------------------------------------------------------------------------------|
| `result` | string/boolean | If a problem has been found, it will return a Summary. Otherwise return false |
