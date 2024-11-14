import NodeCache from 'node-cache';

// Cria uma instância do cache com TTL de 1 hora (3600 segundos)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

class CacheService {
	async get(namespace, key) {
		// Combina o namespace e a chave para formar uma chave única no cache
		const cacheKey = `${namespace}_${key}`;
		return cache.get(cacheKey);
	}

	async set(namespace, key, value) {
		// Combina o namespace e a chave para armazenar o valor no cache
		const cacheKey = `${namespace}_${key}`;
		cache.set(cacheKey, value);
	}

	async clearCache() {
		// Limpa todo o cache
		cache.flushAll();
	}
}

const cacheService = new CacheService();
export default cacheService;
