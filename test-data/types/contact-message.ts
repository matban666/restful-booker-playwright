export interface ContactMessage {
    forEach(arg0: (currentPage: ContactMessage) => void): unknown;
    contactName: string;
    contactEmail: string;
    contactSubject: string;
    contactPhone: string;
    contactDescription: string;
}