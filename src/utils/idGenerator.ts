/**
 * Generate unique ID with pattern: BE + timestamp + random hex
 * Example: BE69041607114c8adb0e42
 */
export class IdGenerator {
  /**
   * Generate unique request ID
   * Pattern: BE + YYMMDDHHMMSS + random hex (8 chars)
   */
  static generateRequestId(): string {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timestamp = `${year}${month}${date}${hours}${minutes}${seconds}`;
    const randomHex = this.generateRandomHex(8);

    return `BE${timestamp}${randomHex}`;
  }

  /**
   * Generate random hex string
   */
  private static generateRandomHex(length: number): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate correlation ID (same pattern)
   */
  static generateCorrelationId(): string {
    return this.generateRequestId();
  }

  /**
   * Generate request UID (same pattern)
   */
  static generateRequestUId(): string {
    return this.generateRequestId();
  }
}

export default IdGenerator;
