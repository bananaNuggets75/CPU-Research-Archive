"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { FileText } from "lucide-react";

interface UploadBoxProps {
  onFileSelected: (file: File) => void;
  error?: string;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileSelected, error }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        onFileSelected(selectedFile);
        setUploadProgress(0);
        setUploading(true);
      }
    },
    [onFileSelected]
  );

  useEffect(() => {
    if (uploading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            toast.success("Upload Complete!");
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [uploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card className="p-6 w-full max-w-2xl text-center shadow-lg bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">File upload</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <FileText className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop or <span className="text-blue-500 cursor-pointer">browse</span> your files
          </p>
        </div>
      </div>
      {file && (
        <div className="mt-4 text-left w-full">
          <div className="flex items-center gap-2 text-gray-700">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <Progress value={uploadProgress} className="mt-2" />
          <p className="text-xs text-gray-500 mt-1">
            {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Upload complete!"}
          </p>
        </div>
      )}
      <Button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={uploadProgress < 100}>
        Done
      </Button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </Card>
  );
};

export default UploadBox;
