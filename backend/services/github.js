import dotenv from 'dotenv';
import cacheService from './cacheService.js';

dotenv.config();

class GithubAPI {
	constructor() {
		this.token = process.env.GITHUB_TOKEN;
		this.baseURL = 'https://api.github.com';
		this.requestQueue = [];
		this.isProcessingQueue = false;
		this.rateLimits = {
			remaining: 60,
			reset: null,
		};
	}

	updateRateLimits(headers) {
		this.rateLimits.remaining = parseInt(
			headers.get('x-ratelimit-remaining'),
			10
		);
		this.rateLimits.reset = parseInt(headers.get('x-ratelimit-reset'), 10);
	}

	async canMakeRequest() {
		if (this.rateLimits.remaining > 0) return true;

		// Calcula o tempo de espera até o reset do limite de taxa
		const resetTime = this.rateLimits.reset * 1000 - Date.now();
		await new Promise((resolve) =>
			setTimeout(resolve, Math.max(1000, resetTime))
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

	// Mover a função buildReposUrl para a classe
	buildReposUrl(language) {
		return `${this.baseURL}/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`;
	}

	// Função genérica para obter dados do cache ou fazer uma nova requisição
	async getFromCacheOrFetch(key, url) {
		const cachedData = await cacheService.get(key, url);
		if (cachedData) return cachedData;

		const fetchData = async () => {
			const data = await this.fetchWithAuth(url);
			await cacheService.set(key, url, data); // Salva os dados no cache
			return data;
		};

		return this.enqueueRequest(fetchData);
	}

	async getRepositories(language) {
		if (!GithubAPI.validLanguages.includes(language)) {
			throw new Error(`Linguagem '${language}' não é válida.`);
		}

		const cacheKey = `repos_${language}`;
		const url = this.buildReposUrl(language);
		return this.getFromCacheOrFetch(cacheKey, url); // Usa o método genérico para buscar ou obter do cache
	}

	async getUser(username) {
		const url = `${this.baseURL}/users/${username}`;
		return this.getFromCacheOrFetch('users', url);
	}

	async getUserRepositories(username) {
		const url = `${this.baseURL}/users/${username}/repos?sort=created&per_page=10`;
		return this.getFromCacheOrFetch(`repos_${username}`, url); // Usa cache específico por usuário
	}

	clearCache() {
		return cacheService.clearCache(); // Limpa o cache, se necessário
	}
}

const githubAPI = new GithubAPI();
export default githubAPI;
