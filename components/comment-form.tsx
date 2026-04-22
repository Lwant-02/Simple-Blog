"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const formSchema = z.object({
  senderName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  content: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be at most 500 characters")
    .regex(/^[ก-๙0-9\s]+$/, "Should be Thai Characters Only"),
});

type FormValues = z.infer<typeof formSchema>;

export function CommentForm({ blogId }: { blogId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderName: "",
      content: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, blogId }),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      setSubmitStatus("success");
      form.reset();
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Leave a Comment</h3>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          Comments are moderated and will appear after approval.
        </p>
      </div>

      {submitStatus === "success" && (
        <Alert className="mb-6 bg-green-50 text-green-900 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
          <AlertDescription>
            Thank you! Your comment has been submitted and is pending
            moderation.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <form id="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="senderName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="senderName">Name</FieldLabel>
                <Input
                  {...field}
                  id="senderName"
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error] as any} />
                )}
              </Field>
            )}
          />
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="content">Message</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="content"
                    placeholder="Share your thoughts..."
                    rows={6}
                    className="min-h-[120px] resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/500 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error] as any} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" form="comment-form" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
