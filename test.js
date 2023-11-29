const fetch = require('node-fetch');
const moment = require('moment/moment');

const authString = Buffer.from('psidorov@tangem.com:ATATT3xFfGF0gUE-UxUUz6vjUzAKXfMVtoUu5XKoS96fr4xT0ZBFUn0D71RcZRVAWxPaDwVg4J0e43Cjk8Cs0Qc3o7DuYKur9mYbPDHJ-025OIdw20q0EZWRDx0pxVbdNmq2-8bZ5a6cu2xH5xIfAy0_QhIkRv6I--45YPiPcQZQXmRWSE2OD0Q=18207DA2').toString('base64');
const headers = { Accept: 'application/json', Authorization: `Basic ${(authString)}` };

fetch('https://tangem.atlassian.net/rest/api/3/project/IOS/versions', {
  method: 'GET',
  headers: {
    ...headers,
    'Content-Type': 'application/json',
  },
}).then((response) => response.json())
  .then((data) => console.log( data.find((item) => item.name === 'Next Release')));

//
// console.log(d);
