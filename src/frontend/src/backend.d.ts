import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Newsletter {
    id: bigint;
    pdf?: ExternalBlob;
    status: string;
    title: string;
    description: string;
    publicationDate: string;
}
export enum Language {
    danish = "danish",
    turkish = "turkish",
    spanish = "spanish",
    bulgarian = "bulgarian",
    english = "english"
}
export interface backendInterface {
    addNewsletter(id: bigint, title: string, description: string, status: string, publicationDate: string, pdf: ExternalBlob | null): Promise<void>;
    addTranslation(language: Language, key: string, value: string): Promise<void>;
    correctNewsletter1PublicationDate(): Promise<void>;
    getAllNewsletters(): Promise<Array<Newsletter>>;
    getAvailableLanguages(): Promise<Array<Language>>;
    getNewsletter(id: bigint): Promise<Newsletter>;
    getPDF(id: bigint): Promise<ExternalBlob | null>;
    getTranslation(language: Language, key: string): Promise<string>;
    updateNewsletterPDF(id: bigint, pdf: ExternalBlob): Promise<void>;
}
