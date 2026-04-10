class GeoJSONPoint {
    readonly type: 'Point';
    readonly coordinates: [number, number];
}

export class PointOfInterestDto {
    readonly firstPoint: GeoJSONPoint;
    readonly secondPoint: GeoJSONPoint;
    readonly radius: number;
}