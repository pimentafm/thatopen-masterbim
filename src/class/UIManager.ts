export class UIManager {
  pages: HTMLElement[] = [];

  constructor() {
    const pages = document.getElementsByClassName("page");
    for (const page of pages) {
      page instanceof HTMLElement
        ? this.pages.push(page)
        : console.warn("Page not found:", page);
    }
  }

  showPage(page: HTMLElement) {
    page.style.display = "flex";
    const pagesToHidde = this.pages.filter(
      (pageInArray) => pageInArray !== page
    );
    pagesToHidde.forEach((element) => {
      element.style.display = "none";
    });
  }

  setPageButton(button: HTMLElement, page: HTMLElement) {
    if (!(page instanceof HTMLElement)) {
      console.warn("Page not found");
      return;
    }
    if (!(button instanceof HTMLElement)) {
      console.warn("Button not found");
      return;
    }
    button.addEventListener("click", () => {
      this.showPage(page);
    });
  }
}
