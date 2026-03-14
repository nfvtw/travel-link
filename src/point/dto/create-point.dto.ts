export class CreatePointDTO {
    readonly name: string;
    readonly coordinates: { type: string; coordinates: [number, number] }; ;
    readonly tags: string[];
}