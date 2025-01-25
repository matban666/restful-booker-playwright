export interface BadEmail {
    forEach(arg0: (currentEmail: BadEmail) => void): unknown;
    email: string;
    error: string;
}