class ApiKeyManager {
  private static currentIndex = 0;
  private static failedKeys = new Set<string>();

  private static getApiKeys(): string[] {
    return [
      process.env.REMOVEBG_API_KEY_1,
      process.env.REMOVEBG_API_KEY_2,
      process.env.REMOVEBG_API_KEY_3,
      process.env.REMOVEBG_API_KEY_4,
      process.env.REMOVEBG_API_KEY_5,
    ].filter((key): key is string => !!key); // Filter out undefined keys
  }

  static getCurrentKey(): string {
    const keys = this.getApiKeys();
    return keys[this.currentIndex];
  }

  static rotateKey(): string | null {
    this.failedKeys.add(this.getCurrentKey());
    
    const keys = this.getApiKeys();
    const availableKeys = keys.filter(key => !this.failedKeys.has(key));
    
    if (availableKeys.length === 0) {
      return null;
    }

    const nextKeyIndex = keys.findIndex(key => !this.failedKeys.has(key));
    this.currentIndex = nextKeyIndex;
    
    return this.getCurrentKey();
  }

  static resetFailedKeys(): void {
    this.failedKeys.clear();
  }

  static initializeKeyReset(): void {
    setInterval(() => {
      this.resetFailedKeys();
    }, 60 * 60 * 1000); // 1 hour
  }
}

// Start the key reset interval
ApiKeyManager.initializeKeyReset();

export default ApiKeyManager; 