import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Link, Upload, Video as VideoIcon } from "lucide-react";

interface MediaUploaderProps {
  editor: Editor;
  type: "image" | "video";
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  editor,
  type,
}) => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUrlSubmit = () => {
    if (!url) return;

    if (type === "image") {
      editor.chain().focus().setImage({ src: url }).run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "video",
          attrs: { src: url, controls: true, width: 640, height: 480 },
        })
        .run();
    }

    setUrl("");
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Implement file upload to your server/storage
      const formData = new FormData();
      formData.append("file", file);

      // Replace with your upload endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();

      if (type === "image") {
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "video",
            attrs: { src: url, controls: true, width: 640, height: 480 },
          })
          .run();
      }
    } catch (error) {
      console.error("Upload error:", error);
      // TODO: Show error message to user
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {type === "image" ? (
            <ImageIcon className="h-4 w-4" />
          ) : (
            <VideoIcon className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Upload {type === "image" ? "Image" : "Video"}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={handleUrlSubmit}>
                  <Link className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>File</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept={
                    type === "image"
                      ? "image/*"
                      : "video/mp4,video/webm,video/ogg"
                  }
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                />
                <Button
                  onClick={handleFileUpload}
                  disabled={!file || uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
