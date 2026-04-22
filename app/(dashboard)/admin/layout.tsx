import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <nav className="flex items-center space-x-2 text-sm font-medium">
                <span className="text-muted-foreground">Admin</span>
                <span className="text-muted-foreground">/</span>
                <span>Dashboard</span>
              </nav>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
