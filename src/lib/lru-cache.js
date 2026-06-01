/**
 * LRU (Least Recently Used) Cache Implementation
 * 
 * A high-performance, memory-efficient caching system that automatically
 * evicts the least recently used items when the cache reaches its maximum size.
 * 
 * Features:
 * - O(1) time complexity for get/set operations
 * - Memory-efficient with automatic cleanup
 * - Statistics tracking for performance monitoring
 * - Configurable max size and TTL (Time To Live)
 * - Thread-safe operations
 */

export class LRUCache {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 1000
    this.ttl = options.ttl || null // Time to live in milliseconds
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      deletes: 0
    }
    
    // Internal storage using Map for O(1) operations
    this.cache = new Map()
    this.timers = new Map() // For TTL support
  }

  /**
   * Get an item from the cache
   * @param {string} key - The cache key
   * @returns {any|null} - The cached value or null if not found/expired
   */
  get(key) {
    // Check if key exists
    if (!this.cache.has(key)) {
      this.stats.misses++
      return null
    }

    // Check if item has expired (TTL support)
    if (this.ttl) {
      const now = Date.now()
      const item = this.cache.get(key)
      
      if (now - item.timestamp > this.ttl) {
        this._evict(key)
        this.stats.misses++
        return null
      }
    }

    // Move item to end (most recently used)
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    
    this.stats.hits++
    return value.data
  }

  /**
   * Set an item in the cache
   * @param {string} key - The cache key
   * @param {any} value - The value to cache
   * @returns {boolean} - True if set successfully, false if evicted
   */
  set(key, value) {
    // Check if key already exists
    if (this.cache.has(key)) {
      // Update existing item
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used item
      const firstKey = this.cache.keys().next().value
      this._evict(firstKey)
    }

    // Add new item
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      accessCount: 0
    })

    // Set up timer for TTL if enabled
    if (this.ttl) {
      const timer = setTimeout(() => {
        this._evict(key)
      }, this.ttl)
      this.timers.set(key, timer)
    }

    this.stats.sets++
    return true
  }

  /**
   * Delete an item from the cache
   * @param {string} key - The cache key
   * @returns {boolean} - True if item was deleted, false if not found
   */
  delete(key) {
    if (!this.cache.has(key)) {
      return false
    }

    this._evict(key)
    this.stats.deletes++
    return true
  }

  /**
   * Check if a key exists in the cache
   * @param {string} key - The cache key
   * @returns {boolean} - True if key exists and is not expired
   */
  has(key) {
    if (!this.cache.has(key)) {
      return false
    }

    // Check TTL if enabled
    if (this.ttl) {
      const now = Date.now()
      const item = this.cache.get(key)
      
      if (now - item.timestamp > this.ttl) {
        this._evict(key)
        return false
      }
    }

    return true
  }

  /**
   * Get the size of the cache
   * @returns {number} - Number of items in cache
   */
  size() {
    return this.cache.size
  }

  /**
   * Clear all items from the cache
   */
  clear() {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
    
    // Clear cache
    this.cache.clear()
    
    // Reset stats
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      deletes: 0
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache performance statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0
    
    return {
      ...this.stats,
      hitRate: hitRate.toFixed(2) + '%',
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize * 100).toFixed(2) + '%'
    }
  }

  /**
   * Get all keys in the cache (LRU order)
   * @returns {Array} - Array of cache keys
   */
  keys() {
    return Array.from(this.cache.keys())
  }

  /**
   * Get all values in the cache (LRU order)
   * @returns {Array} - Array of cache values
   */
  values() {
    return Array.from(this.cache.values()).map(item => item.data)
  }

  /**
   * Get all key-value pairs in the cache (LRU order)
   * @returns {Array} - Array of [key, value] pairs
   */
  entries() {
    return Array.from(this.cache.entries()).map(([key, item]) => [key, item.data])
  }

  /**
   * Evict an item from the cache
   * @private
   */
  _evict(key) {
    const item = this.cache.get(key)
    if (item) {
      this.cache.delete(key)
      this.stats.evictions++
      
      // Clear timer if exists
      const timer = this.timers.get(key)
      if (timer) {
        clearTimeout(timer)
        this.timers.delete(key)
      }
    }
  }

  /**
   * Peek at an item without updating its access time
   * @param {string} key - The cache key
   * @returns {any|null} - The cached value or null if not found/expired
   */
  peek(key) {
    if (!this.cache.has(key)) {
      return null
    }

    // Check TTL if enabled
    if (this.ttl) {
      const now = Date.now()
      const item = this.cache.get(key)
      
      if (now - item.timestamp > this.ttl) {
        this._evict(key)
        return null
      }
    }

    return this.cache.get(key).data
  }

  /**
   * Update the TTL for an existing item
   * @param {string} key - The cache key
   * @param {number} ttl - New TTL in milliseconds
   * @returns {boolean} - True if updated successfully, false if not found
   */
  updateTTL(key, ttl) {
    if (!this.cache.has(key)) {
      return false
    }

    // Clear existing timer
    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(key)
    }

    // Set new TTL
    this.ttl = ttl
    const newTimer = setTimeout(() => {
      this._evict(key)
    }, ttl)
    this.timers.set(key, newTimer)

    return true
  }

  /**
   * Get memory usage estimate
   * @returns {Object} - Memory usage information
   */
  getMemoryUsage() {
    let totalSize = 0
    let itemCount = 0

    this.cache.forEach((item, key) => {
      // Estimate key size (simplified)
      totalSize += key.length * 2 // UTF-16 encoding
      
      // Estimate value size (simplified)
      if (typeof item.data === 'string') {
        totalSize += item.data.length * 2
      } else if (typeof item.data === 'number') {
        totalSize += 8
      } else if (typeof item.data === 'boolean') {
        totalSize += 4
      } else if (item.data && typeof item.data === 'object') {
        // Rough estimate for objects
        totalSize += JSON.stringify(item.data).length * 2
      }
      
      itemCount++
    })

    return {
      itemCount,
      estimatedSize: totalSize,
      averageSize: itemCount > 0 ? totalSize / itemCount : 0
    }
  }

  /**
   * Trim cache to specified size
   * @param {number} maxSize - Maximum size to trim to
   */
  trim(maxSize) {
    if (maxSize >= this.maxSize) {
      return // No need to trim
    }

    const itemsToEvict = this.maxSize - maxSize
    const keys = this.keys()

    for (let i = 0; i < itemsToEvict && i < keys.length; i++) {
      this._evict(keys[i])
    }

    this.maxSize = maxSize
  }

  /**
   * Get the oldest item in the cache
   * @returns {Object|null} - The oldest item or null if cache is empty
   */
  getOldest() {
    if (this.cache.size === 0) {
      return null
    }

    const firstKey = this.cache.keys().next().value
    const item = this.cache.get(firstKey)
    
    return {
      key: firstKey,
      data: item.data,
      timestamp: item.timestamp,
      age: Date.now() - item.timestamp
    }
  }

  /**
   * Get the newest item in the cache
   * @returns {Object|null} - The newest item or null if cache is empty
   */
  getNewest() {
    if (this.cache.size === 0) {
      return null
    }

    const keys = this.keys()
    const lastKey = keys[keys.length - 1]
    const item = this.cache.get(lastKey)
    
    return {
      key: lastKey,
      data: item.data,
      timestamp: item.timestamp,
      age: Date.now() - item.timestamp
    }
  }

  /**
   * Reshape the cache with a new maxSize
   * @param {number} newSize - New maximum size
   */
  reshape(newSize) {
    if (newSize < 1) {
      throw new Error('Cache size must be at least 1')
    }

    // If new size is smaller, trim the cache
    if (newSize < this.maxSize) {
      this.trim(newSize)
    }

    this.maxSize = newSize
  }

  /**
   * Create a new cache with the same contents
   * @returns {LRUCache} - A new cache instance with cloned contents
   */
  clone() {
    const newCache = new LRUCache({
      maxSize: this.maxSize,
      ttl: this.ttl
    })

    // Copy all items to new cache
    this.cache.forEach((item, key) => {
      newCache.cache.set(key, {
        data: item.data,
        timestamp: item.timestamp,
        accessCount: item.accessCount
      })
    })

    // Copy stats
    newCache.stats = { ...this.stats }

    return newCache
  }
}