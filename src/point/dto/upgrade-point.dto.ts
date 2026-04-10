export class UpdatePointDTO {
    readonly id_owner: number
    readonly name?: string;
    readonly description?: string;
    readonly is_free?: boolean;
    readonly photos?: string[];
    readonly coordinates?: { type: string; coordinates: [number, number] };
}