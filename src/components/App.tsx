"use client";

import { useState } from "react";
import Viewer from "./Viewer";
import ImageLoader from "./ImageLoader";

export interface ImageData {
    latitude: number;
    longitude: number;
    altitude: number;
    date: Date;
    filename: string;
}

export default function App() {
    const [images, setImages] = useState<ImageData[]>([]);

    function onImagesLoaded(images: ImageData[]) {
        setImages(images);
        console.log(images);
    }

    return (
        <div>
            {/* {images.length == 0 && <ImageLoader onLoaded={onImagesLoaded} />}
            {images.length != 0 && <Viewer />} */}
            <Viewer />
        </div>
    );
}
