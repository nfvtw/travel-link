export class CreatePointDTO {
    readonly name: string;
    readonly description: string;
    readonly type: string;
    readonly address: string;
    readonly coordinates: { type: string; coordinates: [number, number] };
    readonly tags: string[];
    readonly photos: string[];
}