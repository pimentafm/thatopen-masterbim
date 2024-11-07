export class Utils {
  getInitials(projectName: string): string {
    return projectName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }
}
