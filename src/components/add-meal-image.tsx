"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { ImageIcon } from "lucide-react";

type AddMealImageProps = {
  date: string;
  section: "breakfast" | "lunch" | "dinner";
};

export default function AddMealImage({ date, section }: AddMealImageProps) {
  const generateUploadUrl = useMutation(api.tables.files.generateUploadUrl);
  const linkSectionImage = useMutation(api.tables.files.linkSectionImage);
  const deleteSectionImage = useMutation(api.tables.files.deleteSectionImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const existingFile = useQuery(api.tables.files.getSectionImage, {
    date,
    section,
  });

  useEffect(() => {
    if (existingFile) {
      setImageUrl(existingFile.imageUrl ?? null);
      setFileName(existingFile.fileName ?? null);
    }
  }, [existingFile]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await linkSectionImage({
        date,
        section,
        storageId,
        fileName: file.name,
      });

      setFileName(file.name);
      setImageUrl(`/storage/${storageId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    await deleteSectionImage({ date, section });
    setImageUrl(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {!imageUrl && (
        <>
          {loading ? (
            // Loading skeleton replaces the button
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-200 border-t-gray-500 animate-spin"></div>
          ) : (
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleUpload(file);
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </>
      )}

      {imageUrl && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground">{fileName}</span>
          <button
            type="button"
            className="text-sm text-red-500 hover:underline"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
