"use client";

import { useState } from "react";
import {
  Image as IKImage,
  ImageKitProvider,
} from "@imagekit/next";
import Image from "next/image";
import config from "@/lib/config";
import { upload } from "@imagekit/next";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
    apiEndpoint,
  },
} = config;

interface Props {
  onFileChange: (filePath: string) => void;
}

const ImageUpload = ({ onFileChange }: Props) => {
  const [filePath, setFilePath] =
    useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] =
    useState(false);

  // 🔐 AUTHENTICATION
  const authenticator = async () => {
    const res = await fetch(
      `${apiEndpoint}/api/auth/imagekit`
    );

    if (!res.ok) {
      throw new Error("Auth failed");
    }

    const data = await res.json();

    return {
      token: data.token,
      signature: data.signature,
      expire: Number(data.expire),
    };
  };

  // ✅ VALIDATION
  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only images are allowed");
      return false;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image too large (max 20MB)");
      return false;
    }

    return true;
  };

  // 🚀 UPLOAD
  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setProgress(0);

    try {
      const auth = await authenticator();

      const result = await upload({
        file,
        fileName: file.name,
        publicKey,

        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,

        onProgress: (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const percent = Math.round(
              (event.loaded / event.total) * 100
            );
            setProgress(percent);
          }
        },
      });

      if (result?.url) {
        setFilePath(result.url);
        onFileChange(result.url);
        toast.success("Upload successful 🚀");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 🎨 STYLES (YOUR REQUESTED DESIGN)
  const styles = {
    button:
      "bg-dark-300 flex items-center justify-center gap-2 cursor-pointer px-4 py-3 rounded-md",
    placeholder:
      "text-light-100 text-base",
    text:
      "text-light-100 text-sm",
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <div className="w-full space-y-3">

        {/* INPUT */}
        <input
          type="file"
          accept="image/*"
          id="fileUpload"
          className="hidden"
          onChange={(e) => {
            const file =
              e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />

        {/* BUTTON (UPDATED WITH YOUR STYLE) */}
        <button
          className={cn(
            "upload-btn",
            styles.button
          )}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(
                "fileUpload"
              )
              ?.click();
          }}
        >
          <Image
            src="/icons/upload.svg"
            alt="upload-icon"
            width={20}
            height={20}
            className="object-contain"
          />

          <p
            className={cn(
              styles.placeholder
            )}
          >
            {uploading
              ? `Uploading... ${progress}%`
              : "Upload Image"}
          </p>
          
        </button>

        {/* PROGRESS */}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-green-200 rounded-full">
            <div
              className="progress"
              style={{
                width: `${progress}%`,
              }}
            >
              {progress}%
            </div>
          </div>
        )}

        {/* PREVIEW */}
        {filePath && (
          <div className="mt-4">
            <IKImage
              src={filePath}
              width={500}
              height={300}
              alt="uploaded image"
              transformation={[
                {
                  width: 500,
                  height: 300,
                },
              ]}
            />
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
};

export default ImageUpload;