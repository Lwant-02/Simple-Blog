import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Starting to seed database...");

  // Seed Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: adminPassword },
    create: {
      username: "admin",
      password: adminPassword,
    },
  });

  // Clean up existing data
  await prisma.blogImage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.blog.deleteMany();

  const baseBlogs = [
    {
      title: "Mastering React Server Components",
      summary: "A deep dive into how React Server Components are changing web development.",
      content: "<h2>RSC Evolution</h2><p>React Server Components represent a major shift in how we build React apps.</p>",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    },
    {
      title: "Designing for Dark Mode",
      summary: "Principles for creating stunning dark interfaces without sacrificing brand identity.",
      content: "<h2>Dark Mode Design</h2><p>Designing for dark mode is more than just inverting colors.</p>",
      coverImage: "https://images.unsplash.com/photo-1550439062-609e1531270e",
    },
    {
      title: "Next.js 15: The New Era",
      summary: "Exploring the groundbreaking features of the latest Next.js version.",
      content: "<h2>Next.js 15 Power</h2><p>Next.js 15 introduces major improvements to the App Router.</p>",
      coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655cb",
    },
    {
      title: "TypeScript Generics Explained",
      summary: "Mastering reusable, type-safe code with TypeScript generics.",
      content: "<h2>Generics 101</h2><p>Generics are variables for types in TypeScript.</p>",
      coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    },
    {
      title: "Tailwind CSS v4 Oxide Engine",
      summary: "Why the new Oxide engine makes Tailwind CSS 10x faster.",
      content: "<h2>Oxide Engine</h2><p>Tailwind v4 is built from the ground up in Rust.</p>",
      coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
    }
  ];

  const thaiComments = [
    { senderName: "สมชาย สายลม", content: "บทความดีมากเลยครับ" },
    { senderName: "วิภาวดี รักเรียน", content: "ขอบคุณสำหรับความรู้ครับ" },
    { senderName: "มานะ ขยันเรียน", content: "ติดตามผลงานอยู่เสมอครับ" },
    { senderName: "สุจินต์ โค้ดดิ้ง", content: "เข้าใจง่ายและนำไปใช้ได้จริง" }
  ];

  console.log("Seeding 20 blogs...");

  for (let i = 1; i <= 20; i++) {
    const base = baseBlogs[i % baseBlogs.length];
    await prisma.blog.create({
      data: {
        title: `${base.title} Part ${i}`,
        slug: `${base.title.toLowerCase().replace(/ /g, "-")}-${i}`,
        summary: base.summary,
        content: base.content,
        coverImage: `${base.coverImage}?q=80&w=2000&auto=format&fit=crop&sig=${i}`,
        published: true,
        viewCount: Math.floor(Math.random() * 5000),
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Differing dates for pagination
        comments: {
          create: thaiComments.slice(0, Math.floor(Math.random() * 4) + 1).map(c => ({
            ...c,
            isApproved: true
          }))
        }
      },
    });
  }

  console.log("Database seeded successfully with 20 blogs!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
