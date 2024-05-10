class RequestRateLimitUtils {
  private blocked: Map<string, number> = new Map();

  blockedIP(ip: string): void {
    const fiveTeen: number = 900000;
    this.blocked.set(ip, Date.now() + fiveTeen);
  }

  checkIfTheIpIsBlocked(ip: string): boolean {
    const blocked = this.blocked.get(ip);

    return blocked ? blocked > Date.now() : false;
  }
}

export { RequestRateLimitUtils };
