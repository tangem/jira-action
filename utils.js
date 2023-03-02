const getBranchId = (name) => {
  const jiraMatcher = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;
  const names = name.split('').reverse().join('').match(jiraMatcher);
  if (!names) {
    return false;
  }
  const [firstMatch] = names;
  return firstMatch.split('').reverse().join('');
};

const getParsedIssues = (issuesString) => {
  try {
    return JSON.parse(issuesString);
  } catch (e) {
    return [];
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getBranchId, getParsedIssues };
