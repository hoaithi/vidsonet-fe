"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbnailUploader } from "./thumbnail-uploader";
import { useState } from "react";
import { AiService } from "@/services/ai-service";
import { Button } from "../ui/button";

interface VideoDetailsFormProps {
  form: any;
  isUploading: boolean;
}

export function VideoDetailsForm({ form, isUploading }: VideoDetailsFormProps) {
  const [titles, setTitles] = useState<string[]>([]);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const handleGenerateTitle = async () => {
    try {
      setIsGeneratingTitle(true);
      setTitles([]);
      const videoFile = form.getValues("videoFile");
      if (!videoFile) {
        alert("Please upload video file before generate title");
        setIsGeneratingTitle(false);
      }
      const response = await AiService.generateTitle(videoFile);

      if (response.result && Array.isArray(response.result)) {
        setTitles(response.result.map((item) => item.title));
      }
    } catch (error) {
      console.error("Error generating titles:", error);
      alert("Failed to generate titles. Please try again.");
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleGenerateDescription = async () => {
    try {
      setIsGeneratingDescription(true);
      const videoFile = form.getValues("videoFile");
      if (!videoFile) {
        alert("Please upload video file before generate title");
        setIsGeneratingDescription(false);
      }
      const response = await AiService.generateDescription(videoFile);

      if (response.result) {
        form.setValue("description", response.result.description)
      }
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSelectTitle = (title: string) => {
    form.setValue("title", title);
  };


  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Video Details</h2>

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Title *</FormLabel>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerateTitle}
                  disabled={isGeneratingTitle || isUploading}
                >
                  {isGeneratingTitle
                    ? "Generating ..."
                    : "Generate Title"}
                </Button>
              </div>

              <FormControl>
                <Input placeholder="Enter video title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Hiển thị danh sách tiêu đề được gợi ý */}
        {titles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Choose one of the suggested titles:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {titles.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTitle(t)}
                  className="w-full text-left p-2 border rounded-lg hover:bg-accent hover:text-accent-foreground transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
              <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription || isUploading}
                >
                  {isGeneratingDescription
                    ? "Generating ..."
                    : "Generate Description"}
                </Button>
              </div>
              
              <FormControl>
                <Textarea
                  placeholder="Tell viewers about your video"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail */}
        <ThumbnailUploader form={form} isUploading={isUploading} />

        {/* Premium checkbox */}
        <FormField
          control={form.control}
          name="isPremium"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isUploading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Premium Content</FormLabel>
                <FormDescription>
                  Make this video available only to your channel members.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
