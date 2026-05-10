"use client";

import { useState } from "react";
import {
  Image as IKImage,
  Video,
  ImageKitProvider,
} from "@imagekit/next";
import Image from "next/image";
import { cn } from "@/lib/utils";
import config from "@/lib/config";


const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const uploadFileToServer = (
  file: File,
  folder: string,
  onProgress: (percent: number) => void,
): Promise<{ filePath: string }> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/imagekit");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(
          new Error(
            `Upload failed with status ${xhr.status}: ${xhr.responseText || xhr.statusText}`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Request to upload endpoint failed due to network error"
        )
      );
    };

    xhr.send(formData);
  });
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant?: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant = "dark",
  onFileChange,
  value,
}: Props) => {
  const [filePath, setFilePath] = useState<string | null>(
    value ?? null
  );
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border border-gray-200",
    text:
      variant === "dark" ? "text-light-100" : "text-dark-400",
    placeholder:
      variant === "dark" ? "text-light-100" : "text-slate-500",
  };

  // ✅ Validate file
  const validateFile = (file: File) => {
    const limit = type === "image" ? 20 : 50;

    if (file.size > limit * 1024 * 1024) {
      console.error(`File too large (max ${limit}MB)`);
      return false;
    }

    return true;
  };

  // ✅ Upload handler
  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadFileToServer(file, folder, (percent) => {
        setProgress(percent);
      });
      const path = res.filePath ?? null;

      setFilePath(path);
      if (path) onFileChange(path);

      console.log(`${type} uploaded successfully 🚀`);
    } catch (err: any) {
      console.error("Upload error:", err?.message || err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <div className="w-full space-y-3">
        {/* Hidden Input */}
        <input
          type="file"
          accept={accept}
          id="fileUpload"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />

        {/* Upload Button */}
        <label
          htmlFor="fileUpload"
          className={cn(
            "upload-btn flex items-center justify-center gap-2 cursor-pointer",
            styles.button,
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Image
            src="/icons/upload.svg"
            alt="upload"
            width={20}
            height={20}
          />

          <span className={styles.placeholder}>
            {uploading ? "Uploading..." : placeholder}
          </span>
        </label>

        {/* File name */}
        {filePath && (
          <p className={cn("upload-filename", styles.text)}>
            {filePath}
          </p>
        )}

        {/* Progress */}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-green-200 rounded-full">
            <div
              className="progress"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        {/* Preview */}
        {filePath && (
          <div className="mt-4">
            {type === "image" ? (
              <IKImage
                src={filePath}
                width={500}
                height={300}
                alt="uploaded"
                transformation={[
                  { width: 500, height: 300 },
                ]}
              />
            ) : (
              <Video
                src={filePath}
                controls
                className="w-full rounded-xl"
              />
            )}
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
};

export default FileUpload;