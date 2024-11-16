const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

// Definição das chaves de cache
const REPOS_CACHE_KEY = 'github_repos_cache';
const USERS_CACHE_KEY = 'github_users_cache';
const LANGUAGES_CACHE_KEY = 'github_languages_cache';

class GithubAPI {
  constructor() {
    this.token = import.meta.env.VITE_GITHUB_TOKEN;
    this.baseURL = 'https://api.github.com';
    this.requestQueue = [];
    this.isProcessingQueue = false;

    this.cache = {
      repos: this.getFromStorage(REPOS_CACHE_KEY) || {},
      users: this.getFromStorage(USERS_CACHE_KEY) || {},
      languages: this.getFromStorage(LANGUAGES_CACHE_KEY) || {}, // Cache de linguagens
    };

    this.rateLimits = {
      remaining: 60,
      reset: null,
    };
  }

  getFromStorage(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  setToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }

  isValidCache(cacheItem) {
    return (
      cacheItem &&
      cacheItem.timestamp &&
      Date.now() - cacheItem.timestamp < CACHE_DURATION
    );
  }

  updateRateLimits(headers) {
    this.rateLimits.remaining = parseInt(
      headers.get('x-ratelimit-remaining'),
      10,
    );
    this.rateLimits.reset = parseInt(headers.get('x-ratelimit-reset'), 10);
  }

  async canMakeRequest() {
    if (this.rateLimits.remaining > 0) return true;

    const resetTime = this.rateLimits.reset * 1000 - Date.now();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(1000, resetTime)),
    );
    return true;
  }

  async fetchWithAuth(url) {
    await this.canMakeRequest();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    this.updateRateLimits(response.headers);

    if (response.status === 404) {
      throw new Error(`Recurso não encontrado: ${url}`);
    } else if (!response.ok) {
      throw new Error(`Erro da API do GitHub: ${response.statusText}`);
    }

    return response.json();
  }

  async enqueueRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ request: requestFn, resolve, reject });
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const { request, resolve, reject } = this.requestQueue.shift();
      try {
        const response = await request();
        resolve(response);
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  static validLanguages = [
    'javascript',
    'python',
    'java',
    'c++',
    'c#',
    'typescript',
    'go',
    'html',
    'css',
    'ruby',
    'php',
    'rust',
    'kotlin',
    'dart',
    'scala',
    'r',
    'perl',
    'haskell',
    'julia',
    'lua',
    'shell',
    'swift',
    'powershell',
    'sql',
  ];

  async getLanguages(repoName) {
    const cacheKey = `languages_${repoName}`;
    const cachedData = this.cache.languages[cacheKey];

    if (this.isValidCache(cachedData)) {
      return cachedData.data;
    }

    const url = `${this.baseURL}/repos/${repoName}/languages`;
    const data = await this.fetchWithAuth(url);

    // Armazena o resultado no cache e no localStorage
    this.cache.languages[cacheKey] = { timestamp: Date.now(), data };
    this.setToStorage(LANGUAGES_CACHE_KEY, this.cache.languages);

    return data;
  }

  async getRepositories(language) {
    if (!GithubAPI.validLanguages.includes(language)) {
      throw new Error(`Linguagem '${language}' não é válida.`);
    }

    const cacheKey = `repos_${language}`;
    const cachedData = this.cache.repos[cacheKey];

    if (this.isValidCache(cachedData)) {
      return cachedData.data;
    }

    const fetchRepos = async () => {
      const encodedLanguage = encodeURIComponent(language);
      const url = `${this.baseURL}/search/repositories?q=language:${encodedLanguage}&sort=stars&order=desc&per_page=10`;

      const data = await this.fetchWithAuth(url);

      if (!data.items) {
        throw new Error('A resposta da API não contém repositórios');
      }

      this.cache.repos[cacheKey] = { timestamp: Date.now(), data: data.items };
      this.setToStorage(REPOS_CACHE_KEY, this.cache.repos);

      return data.items;
    };

    return this.enqueueRequest(fetchRepos);
  }

  async getUser(username) {
    const cachedData = this.cache.users[username];

    if (this.isValidCache(cachedData)) {
      return cachedData.data;
    }

    const fetchUser = async () => {
      const url = `${this.baseURL}/users/${username}`;
      const data = await this.fetchWithAuth(url);

      this.cache.users[username] = { timestamp: Date.now(), data };
      this.setToStorage(USERS_CACHE_KEY, this.cache.users);

      return data;
    };

    return this.enqueueRequest(fetchUser);
  }

  async getUserRepositories(username) {
    const cacheKey = `repos_${username}`;
    const cachedData = this.cache.repos[cacheKey];

    if (this.isValidCache(cachedData)) {
      return cachedData.data;
    }

    const fetchRepos = async () => {
      const url = `${this.baseURL}/users/${username}/repos?sort=created&per_page=10`;
      const data = await this.fetchWithAuth(url);

      if (!Array.isArray(data)) {
        throw new Error('A resposta da API não contém repositórios');
      }

      this.cache.repos[cacheKey] = { timestamp: Date.now(), data };
      this.setToStorage(REPOS_CACHE_KEY, this.cache.repos);

      return data;
    };

    return this.enqueueRequest(fetchRepos);
  }

  clearCache() {
    this.cache = { repos: {}, users: {}, languages: {} };
    localStorage.removeItem(REPOS_CACHE_KEY);
    localStorage.removeItem(USERS_CACHE_KEY);
    localStorage.removeItem(LANGUAGES_CACHE_KEY);
  }
}

const githubAPI = new GithubAPI();
export default githubAPI;
