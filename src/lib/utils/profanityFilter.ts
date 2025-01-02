export class ProfanityFilter {
  private readonly profanityList: Set<string>;

  constructor() {
    this.profanityList = new Set([
      // Add profanity words here
    ]);
  }

  public containsProfanity(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/);
    return words.some(word => this.profanityList.has(word));
  }

  public filterText(text: string): string {
    const words = text.split(/\s+/);
    return words
      .map(word => this.profanityList.has(word.toLowerCase()) ? '*'.repeat(word.length) : word)
      .join(' ');
  }
}

export default new ProfanityFilter(); 