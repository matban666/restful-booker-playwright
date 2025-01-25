export interface Location {
    latitude: number;
    longitude: number;
}

export interface Contact {
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface Branding {
    forEach(arg0: (currentPage: Branding) => void): unknown;
    name: string;
    map: Location;
    logoUrl: string;
    description: string;
    contact: Contact;
}