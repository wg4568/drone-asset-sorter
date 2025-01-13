"use client";

import { createContext, useState } from "react";
import ImageLoader from "./ImageLoader";

export interface ImageData {
    latitude: number;
    longitude: number;
    date: Date;
    file: File;
}

export default function App() {
    const [images, setImages] = useState<ImageData[]>([]);

    function onImagesLoaded(images: ImageData[]) {
        setImages(images);
    }

    return (
        <div>
            {images.length == 0 && <ImageLoader onLoaded={onImagesLoaded} />}
        </div>
    );
}
