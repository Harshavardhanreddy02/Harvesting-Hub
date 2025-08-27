import {createClient} from 'redis';
import dotenv from 'dotenv';

dotenv.config();


class RedisService {
    constructor() {
        // console.log(process.env.REDIS_URL);
        this.redis = createClient({
            url: process.env.REDIS_URL
        });
    }

    async connectToRedis() {
        try {
            await this.redis.connect();
            console.log('Connected to Redis successfully');
        } catch (error) {
            console.error('Redis connection error:', error);
        }
    }

    // Generic cache methods
    async getCache(key) {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    async setCache(key, data, expirationInSeconds = 3600) {
        try {
            await this.redis.setEx(key, expirationInSeconds, JSON.stringify(data));
        } catch (error) {
            console.error('Redis set error:', error);
        }
    }

    // Product-specific cache methods
    async getProductList() {
        return this.getCache('products:list');
    }

    async setProductList(products) {
        await this.setCache('products:list', products);
    }

    async getProduct(productId) {
        return this.getCache(`product:${productId}`);
    }

    async setProduct(productId, product) {
        await this.setCache(`product:${productId}`, product);
    }

    async getFarmerProducts(email) {
        return this.getCache(`farmer:products:${email}`);
    }

    async setFarmerProducts(email, products) {
        await this.setCache(`farmer:products:${email}`, products);
    }

    // User-specific cache methods
    async getUser(userId) {
        return this.getCache(`user:${userId}`);
    }

    async setUser(userId, userData) {
        await this.setCache(`user:${userId}`, userData);
    }

    // Cache invalidation methods
    async invalidateProductCache(productId) {
        try {
            await this.redis.del(`product:${productId}`);
            await this.redis.del('products:list');
            // Invalidate related caches
            const keys = await this.redis.keys('farmer:products:*');
            if (keys.length > 0) {
                await this.redis.del(keys);
            }
        } catch (error) {
            console.error('Redis invalidation error:', error);
        }
    }

    async invalidateFarmerCache(email) {
        try {
            await this.redis.del(`farmer:products:${email}`);
            await this.redis.del('products:list');
        } catch (error) {
            console.error('Redis farmer cache invalidation error:', error);
        }
    }

    async invalidateAllProductCache() {
        try {
            const keys = await this.redis.keys('product:*');
            keys.push('products:list');
            const farmerKeys = await this.redis.keys('farmer:products:*');
            keys.push(...farmerKeys);
            if (keys.length > 0) {
                await this.redis.del(keys);
            }
        } catch (error) {
            console.error('Redis invalidate all error:', error);
        }
    }
}

const redisClient = new RedisService();
export default redisClient;