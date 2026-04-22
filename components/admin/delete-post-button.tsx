"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DeletePostButtonProps {
  id: string;
}

export function DeletePostButton({ id }: DeletePostButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Post deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      disabled={isLoading}
      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
