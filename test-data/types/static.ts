export interface Page {
    forEach(arg0: (currentPage: Page) => void): unknown;
    name: string;
    requiresAuth: boolean;
    relativePath: boolean;
}
