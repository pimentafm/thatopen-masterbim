export class Utils {
  getInitials(projectName: string): string {
    const words = projectName
      .trim()
      .split(" ")
      .filter((word) => word.length > 0);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return words
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }
}
