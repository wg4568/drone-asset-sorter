"use client";

import { ExifData, getExifCoordinates, getExifTime } from "@/util/exif";
import EXIF from "exif-js";
import React, { ChangeEvent, useState } from "react";
import { ImageData } from "./App";

export default function Uploader() {
    const [files, setFiles] = useState<FileList | null>();
    const [loadedFiles, setLoadedFiles] = useState<ImageData[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    function onFileSelect(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setFiles(event.target.files);
    }

    function processFiles() {
        if (!files) return;

        let totalLoaded = 0;

        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();

            reader.onload = (_: ProgressEvent<FileReader>) => {
                var exif: ExifData = EXIF.readFromBinaryFile(reader.result);
                var data = {
                    ...getExifCoordinates(exif),
                    date: getExifTime(exif),
                    file: files[i],
                };

                setLoadedFiles([...loadedFiles, data]);

                totalLoaded += 1;

                console.log(totalLoaded, files.length, data);

                if (totalLoaded >= files.length) {
                    setIsLoaded(true);
                }
            };

            reader.readAsArrayBuffer(files[i]);
        }
    }

    return (
        <div>
            <input type="file" multiple onChange={onFileSelect} />
            <button
                onClick={processFiles}
                className="border-solid border-[1px] border-gray-500 rounded-md px-2 bg-gray-100 hover:bg-gray-300"
            >
                Process
            </button>
        </div>
    );
}
