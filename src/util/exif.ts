export interface ExifData {
    GPSLatitude: [number, number, number];
    GPSLongitude: [number, number, number];
    GPSLatitudeRef: "N" | "S";
    GPSLongitudeRef: "W" | "E";
    GPSAltitude: {
        numerator: number;
        denominator: number;
    };
    DateTimeOriginal: string;
}

export function getExifCoordinates(exif: ExifData) {
    // Degrees + Minutes/60 + Seconds/3600
    let latitude =
        exif.GPSLatitude[0] +
        exif.GPSLatitude[1] / 60 +
        exif.GPSLatitude[2] / 3600;

    let longitude =
        exif.GPSLongitude[0] +
        exif.GPSLongitude[1] / 60 +
        exif.GPSLongitude[2] / 3600;

    if (exif.GPSLatitudeRef === "S") {
        latitude *= -1;
    }

    if (exif.GPSLongitudeRef === "W") {
        longitude *= -1;
    }

    return { latitude, longitude };
}

export function getExifTime(exif: ExifData) {
    // 2025:01:12 08:55:17
    var split = exif.DateTimeOriginal.split(" ");
    var date = split[0].replace(/:/g, "-");
    return new Date(date + " " + split[1]);
}

export function getExifAltitude(exif: ExifData) {
    return exif.GPSAltitude.numerator / exif.GPSAltitude.denominator;
}
