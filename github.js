const github = require('@actions/github');

const { context, getOctokit } = github;
const githubApi = (githubToken, githubEmail, githubUser) => {
  const { repo: { owner, repo }, issue: { number: pullNumber } } = context;

  const { rest } = getOctokit(githubToken);

  const jiraMatcher = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;

  return {
    getIssues: async () => {
      const response = await rest.pulls.listCommits({
        owner,
        repo,
        pull_number: pullNumber,
      });

      return response.data.reduce(
        (issues, item) => {
          const names = item.commit.message.split('').reverse().join('').match(jiraMatcher);
          if (!names) {
            return issues;
          }
          names.forEach((res) => {
            const id = res.split('').reverse().join('');
            if (issues.indexOf(id) === -1) {
              issues.push(id);
            }
          });
          return issues;
        },
        [],
      );
    },

    createComment: async (body) => rest.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body,
    }),

    createOrUpdateFileContents:
      async (path, releaseVersion, content) => rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `feat: Added Version ${releaseVersion}.md`,
        content: Buffer.from(content).toString('base64'),
        committer: {
          name: githubUser || owner,
          email: githubEmail,
        },
        author: {
          name: githubUser || owner,
          email: githubEmail,
        },
      }),
  };
};

module.exports = githubApi;
