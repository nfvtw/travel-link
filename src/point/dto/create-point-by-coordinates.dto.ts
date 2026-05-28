export class CreatePointByCoordinatesDTO {
    readonly name: string;
    readonly description: string;
    readonly type: string;
    readonly coordinates: [number, number]
    readonly tags: string[];
    readonly photos: string[];
}