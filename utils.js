const getBranchId = (name) => {
  const jiraMatcher = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;
  const names = name.split('').reverse().join('').match(jiraMatcher);
  if (!names) {
    return false;
  }
  const [firstMatch] = names;
  return firstMatch.split('').reverse().join('');
};

// eslint-disable-next-line import/prefer-default-export
export { getBranchId };
