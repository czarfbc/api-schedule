class RequestRateLimitUtils {
  private blocked: Map<String, number> = new Map();

  blockedIP(ip: string): void {
    const fiveteen: number = 900000;
    this.blocked.set(ip, Date.now() + fiveteen);
  }

  checkIfTheIpIsBlocked(ip: string): boolean {
    const blocked = this.blocked.get(ip);

    return blocked ? blocked > Date.now() : false;
  }
}

export { RequestRateLimitUtils };
