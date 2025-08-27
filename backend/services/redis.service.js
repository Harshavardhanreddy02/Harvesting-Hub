// Dummy Redis service for serverless compatibility
// This file exists to prevent import errors but doesn't actually use Redis

class RedisService {
    constructor() {
        // No Redis connection in serverless environment
    }

    async connectToRedis() {
        // No-op for serverless
        return Promise.resolve();
    }

    async getCache(key) {
        // Return null to simulate cache miss
        return null;
    }

    async setCache(key, data, expirationInSeconds = 3600) {
        // No-op for serverless
        return Promise.resolve();
    }

    async getUser(userId) {
        // Return null to force database lookup
        return null;
    }

    async setUser(userId, userData) {
        // No-op for serverless
        return Promise.resolve();
    }

    async getProduct(productId) {
        // Return null to force database lookup
        return null;
    }

    async setProduct(productId, product) {
        // No-op for serverless
        return Promise.resolve();
    }

    async getProductList() {
        // Return null to force database lookup
        return null;
    }

    async setProductList(products) {
        // No-op for serverless
        return Promise.resolve();
    }

    async getFarmerProducts(email) {
        // Return null to force database lookup
        return null;
    }

    async setFarmerProducts(email, products) {
        // No-op for serverless
        return Promise.resolve();
    }

    async invalidateProductCache(productId) {
        // No-op for serverless
        return Promise.resolve();
    }

    async invalidateFarmerCache(email) {
        // No-op for serverless
        return Promise.resolve();
    }

    async invalidateAllProductCache() {
        // No-op for serverless
        return Promise.resolve();
    }
}

const redisClient = new RedisService();
export default redisClient;
