export class CreatePointByAddressDTO {
    readonly name: string;
    readonly type: string;
    readonly description: string;
    readonly address: string;
    readonly tags: string[];
    readonly photos: string[];
}