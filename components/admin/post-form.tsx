"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Calendar, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { BlogWithImages } from "@/types";

import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string("Must be a valid URL"),
  published: z.boolean(),
  images: z
    .array(
      z.object({
        url: z.string("Must be a valid URL"),
      }),
    )
    .max(6, "Max 6 additional images allowed"),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  initialData?: BlogWithImages | null;
  isEdit?: boolean;
}

export function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      summary: initialData?.summary || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      published: initialData?.published || false,
      images: initialData?.images?.map((img: any) => ({ url: img.url })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  async function onSubmit(data: PostFormValues) {
    setIsLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/posts/${initialData?.id}`
        : "/api/admin/posts";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      if (res.ok) {
        toast.success(
          isEdit ? "Post updated successfully" : "Post created successfully",
        );
        router.refresh();
        router.push("/admin/dashboard/posts");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save post");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-muted-foreground/10">
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>
                The core details of your blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">Title</FieldLabel>
                      <Input
                        id="title"
                        placeholder="Mastering React Server Components"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error] as any} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1  gap-6">
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="slug">URL Slug</FieldLabel>
                        <Input
                          id="slug"
                          placeholder="mastering-react-server-components"
                          {...field}
                        />
                        <FieldDescription>
                          The unique identifier for the URL
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error] as any} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
                        <div className="space-y-0.5 w-full">
                          <div className="flex items-center justify-between w-full">
                            <FieldLabel className="text-sm font-medium leading-none">
                              Publish Status
                            </FieldLabel>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Make this post visible to everyone
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="summary"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="summary">Summary</FieldLabel>
                      <Textarea
                        id="summary"
                        placeholder="A brief overview for the listing page card..."
                        className="resize-none h-24"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error] as any} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="content"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="content">
                        Article Body (HTML supported)
                      </FieldLabel>
                      <Textarea
                        id="content"
                        placeholder="Write your article content here..."
                        className="min-h-[400px] font-mono text-sm"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error] as any} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-muted-foreground/10">
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>
                Add up to 6 secondary images for the post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <Controller
                      control={form.control}
                      name={`images.${index}.url`}
                      render={({ field, fieldState }) => (
                        <Field
                          className="flex-1"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel
                            className={index !== 0 ? "sr-only" : ""}
                            htmlFor={`images.${index}.url`}
                          >
                            Image {index + 1} URL
                          </FieldLabel>
                          <Input
                            id={`images.${index}.url`}
                            placeholder="https://images.unsplash.com/..."
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error] as any} />
                          )}
                        </Field>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:bg-destructive/10 h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </FieldGroup>
              {fields.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ url: "" })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Image
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm border-muted-foreground/10">
            <CardHeader>
              <CardTitle>Settings & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="coverImage"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="coverImage">
                        Main Cover Image URL
                      </FieldLabel>
                      <div className="space-y-4">
                        <Input
                          id="coverImage"
                          placeholder="https://images.unsplash.com/..."
                          {...field}
                        />
                        {field.value && (
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                            <img
                              src={field.value}
                              alt="Preview"
                              className="object-cover w-full h-full"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          </div>
                        )}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error] as any} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Created:</span>
                  <span className="font-medium">
                    {initialData?.createdAt
                      ? format(new Date(initialData.createdAt), "PPP")
                      : "New Post"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Views:</span>
                  <span className="font-medium">
                    {initialData?.viewCount || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-primary/20 bg-primary/5 sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Finalize Post</CardTitle>
              <CardDescription>
                Review all details before saving
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="submit"
                className="w-full h-10 rounded-xl font-bold shadow-lg flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Changes"
                ) : (
                  "Publish Post"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-10"
                onClick={() => router.push("/admin/dashboard/posts")}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
