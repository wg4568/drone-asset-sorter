"use client";

import {
    ExifData,
    getExifAltitude,
    getExifCoordinates,
    getExifTime,
} from "@/util/exif";
import EXIF from "exif-js";
import { useEffect, useRef, useState } from "react";
import { ImageData } from "./App";

type LoadingState = {
    loaded: number;
    total: number;
};

interface ImageLoaderProps {
    onLoaded: (imageData: ImageData[]) => void;
}

export default function ImageLoader({ onLoaded }: ImageLoaderProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [imageData, setImageData] = useState<ImageData[]>([]);

    const [loadingState, setLoadingState] = useState<LoadingState>({
        loaded: 0,
        total: 0,
    });

    function onSubmit() {
        if (!fileInput.current || !fileInput.current.files) return;

        let files = fileInput.current.files;
        let totalFiles = files.length;

        setLoadingState({
            loaded: 0,
            total: totalFiles,
        });

        for (let i = 0; i < totalFiles; i++) {
            let reader = new FileReader();

            reader.onload = (_: ProgressEvent<FileReader>) => {
                var exif: ExifData = EXIF.readFromBinaryFile(reader.result);
                var data = {
                    ...getExifCoordinates(exif),
                    date: getExifTime(exif),
                    altitude: getExifAltitude(exif),
                    filename: files[i].name,
                };

                // console.log(exif);

                setImageData((prev: ImageData[]) => {
                    return [...prev, data];
                });

                setLoadingState((prev: LoadingState) => {
                    return {
                        ...prev,
                        loaded: prev.loaded + 1,
                    };
                });
            };

            reader.readAsArrayBuffer(files[i]);
        }
    }

    useEffect(() => {
        if (loadingState.loaded >= loadingState.total) {
            onLoaded(imageData);
        }
    }, [loadingState]);

    return (
        <div>
            <input ref={fileInput} type="file" multiple />
            <button
                onClick={onSubmit}
                className="border-solid border-[1px] border-gray-500 rounded-md px-2 bg-gray-100 hover:bg-gray-300"
            >
                Go!
            </button>

            <p>
                Loading image {loadingState.loaded}/{loadingState.total}...
            </p>

            <p>
                {Math.round((loadingState.loaded / loadingState.total) * 100)}%
            </p>
        </div>
    );
}
