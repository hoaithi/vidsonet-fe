'use client';

import { useRef, useState } from 'react';
import { Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

interface ThumbnailUploaderProps {
  form: any;
  isUploading: boolean;
}

export function ThumbnailUploader({ form, isUploading }: ThumbnailUploaderProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('thumbnailFile', file, { shouldValidate: true });
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return (
    <FormField
      control={form.control}
      name="thumbnailFile"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Thumbnail</FormLabel>
          <FormControl>
            <div className="space-y-3">
              <Input
                type="file"
                ref={thumbnailInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => thumbnailInputRef.current?.click()}
                disabled={isUploading}
              >
                <Image className="h-4 w-4 mr-2" />
                {thumbnailPreview ? 'Change Thumbnail' : 'Upload Thumbnail'}
              </Button>

              {thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="max-h-40 rounded-md"
                  />
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>Recommended size: 1280×720 (16:9)</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
