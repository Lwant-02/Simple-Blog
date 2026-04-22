import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, MessageSquare, Eye, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Admin - Dashboard",
  description: "Admin dashboard",
};

export default async function AdminDashboard() {
  const [blogCount, commentCount, viewStats] = await Promise.all([
    prisma.blog.count(),
    prisma.comment.count({ where: { isApproved: false } }),
    prisma.blog.aggregate({
      _sum: {
        viewCount: true,
      },
    }),
  ]);

  const stats = [
    {
      title: "Total Posts",
      value: blogCount,
      description: "Articles published and drafts",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Total Views",
      value: viewStats._sum.viewCount || 0,
      description: "Cumulative article views",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Pending Comments",
      value: commentCount,
      description: "Comments awaiting moderation",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      title: "Engagement Rate",
      value: "4.2%",
      description: "Average views per post",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your blog today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="shadow-sm border-muted-foreground/10"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="shadow-sm border-muted-foreground/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used management tools</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <a
              href="/admin/posts/new"
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <FileText className="h-8 w-8 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">Create New Post</span>
            </a>
            <a
              href="/admin/comments"
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <MessageSquare className="h-8 w-8 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">Moderate Comments</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
