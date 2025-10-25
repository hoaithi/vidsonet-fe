import { Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef, useState } from "react";

export default function VideoFileUploader({form, isUploading}:any){
    const[videoPreview, setVideoPreview] = useState<string>(''); 
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            form.setValue('videoFile', file, {shouldValidate: true});
            setVideoPreview(URL.createObjectURL(file))
        }
    };

    return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Select Video</h2>
            <Input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
            />
            <Button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>

          {videoPreview ? (
            <video src={videoPreview} className="w-full aspect-video rounded-md" controls />
          ) : (
            <div className="border-2 border-dashed rounded-md p-12 text-center text-muted-foreground">
              Click the button above to select a video file
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}