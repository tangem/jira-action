const fetch = require('node-fetch');
const YAML = require('yaml');
const fs = require('fs');

class JiraFetch {
  #baseUrl;

  #headers;

  constructor() {
    const configPath = `${process.env.HOME}/jira/config.yml`;
    const { email, token, baseUrl } = YAML.parse(fs.readFileSync(configPath, 'utf8'));
    const authString = Buffer.from(`${email}:${token}`).toString('base64');
    this.#baseUrl = baseUrl;
    this.#headers = { Accept: 'application/json', Authorization: `Basic ${(authString)}` };
  }

  #fetch = (command, opts = {}) => fetch(`${this.#baseUrl}/rest/api/3/${command}`, { method: 'GET', headers: this.#headers, ...opts });

  getRequest = async (command) => {
    const res = await this.#fetch(command);

    return res.json();
  };

  postRequest = async (command, body) => {
    let response;

    try {
      response = await this.#fetch(command, {
        method: 'POST',
        headers: {
          ...this.#headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw new Error('There was an error', error);
    }

    if (!response?.ok) {
      throw new Error(`HTTP Response Code: ${response?.status}`);
    }

    return response.json();
  };

  putRequest = async (command, body) => {
    const res = await this.#fetch(command, {
      method: 'PUT',
      headers: {
        ...this.#headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  putRequestText = async (command, body) => {
    const res = await this.#fetch(command, {
      method: 'PUT',
      headers: {
        ...this.#headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log(res);
    console.log(JSON.stringify(res));
    console.log(res.text());
    return res.text();
  };
}

module.exports = JiraFetch;
