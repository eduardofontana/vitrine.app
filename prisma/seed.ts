import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const profiles = await Promise.all([
    prisma.profile.upsert({
      where: { email: "rafael@exemplo.com" },
      update: {},
      create: {
        id: "11111111-1111-4111-8111-111111111111",
        name: "Rafael Silva",
        email: "rafael@exemplo.com",
        username: "rafaelsilva",
        bio: "Full-stack developer ha 8 anos. Crio produtos digitais e vendo side projects validados.",
        role: "USER",
      },
    }),
    prisma.profile.upsert({
      where: { email: "ana@exemplo.com" },
      update: {},
      create: {
        id: "22222222-2222-4222-8222-222222222222",
        name: "Ana Costa",
        email: "ana@exemplo.com",
        username: "anacosta",
        bio: "Dev mobile e empreendedora. Construo apps e produtos para pequenos negocios.",
        role: "USER",
      },
    }),
    prisma.profile.upsert({
      where: { email: "lucas@exemplo.com" },
      update: {},
      create: {
        id: "33333333-3333-4333-8333-333333333333",
        name: "Lucas Oliveira",
        email: "lucas@exemplo.com",
        username: "lucasoliveira",
        bio: "Maker e indie hacker. Gosto de automacoes, bots e ferramentas para devs.",
        role: "USER",
      },
    }),
    prisma.profile.upsert({
      where: { email: "admin@vitrine.app" },
      update: { role: "ADMIN" },
      create: {
        id: "44444444-4444-4444-8444-444444444444",
        name: "Admin Vitrine",
        email: "admin@vitrine.app",
        username: "admin",
        role: "ADMIN",
      },
    }),
  ]);

  const projects = [
    {
      ownerId: profiles[0].id,
      name: "TaskFlow",
      slug: "taskflow",
      shortDescription:
        "Ferramenta de gestao de tarefas com kanban, time tracking e relatorios para pequenas equipes.",
      description:
        "TaskFlow e uma plataforma completa de gestao de tarefas e projetos. Possui kanban drag-and-drop, time tracking, relatorios de produtividade, integracao com Slack e GitHub e suporte a multiplos times.",
      category: "MICRO_SAAS",
      projectType: "SaaS",
      status: "COM_RECEITA",
      approvalStatus: "APROVADO",
      price: 45000,
      acceptsOffers: true,
      monthlyRevenue: 3200,
      monthlyCosts: 480,
      usersCount: 230,
      demoUrl: "https://taskflow-demo.vercel.app",
      websiteUrl: "https://taskflow.app",
      repositoryInfo: "Disponivel mediante NDA",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker"],
      includedAssets: ["CODIGO_FONTE", "DOMINIO", "MARCA", "DOCUMENTACAO", "BANCO_DADOS"],
      screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"],
      reasonForSelling: "Estou migrando para uma nova empreitada e nao tenho mais tempo para manter o projeto.",
      isFeatured: true,
      hasVerifiedDemo: true,
      hasVerifiedRevenue: true,
      hasSecureSale: true,
    },
    {
      ownerId: profiles[1].id,
      name: "PlantCare",
      slug: "plantcare",
      shortDescription:
        "App mobile para identificar plantas, agendar regas e conectar amantes de jardinagem.",
      description:
        "PlantCare e um aplicativo mobile para amantes de jardinagem. Use a camera para identificar plantas, receba lembretes de rega personalizados e conecte-se com outros jardineiros.",
      category: "APP_MOBILE",
      projectType: "Mobile App",
      status: "COM_USUARIOS",
      approvalStatus: "APROVADO",
      price: 28000,
      acceptsOffers: true,
      monthlyRevenue: 1500,
      monthlyCosts: 200,
      usersCount: 3400,
      demoUrl: "https://plantcare.app",
      repositoryInfo: "Codigo-fonte completo incluso",
      techStack: ["React Native", "TypeScript", "Firebase", "Stripe", "ML Kit"],
      includedAssets: ["CODIGO_FONTE", "MARCA", "CLIENTES", "DOCUMENTACAO"],
      screenshots: ["https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80"],
      reasonForSelling: "Recebi uma oportunidade fora e nao consigo mais dedicar tempo ao projeto.",
      isFeatured: true,
      hasVerifiedCode: true,
    },
    {
      ownerId: profiles[2].id,
      name: "FormKit",
      slug: "formkit",
      shortDescription:
        "Gerador de formularios com drag-and-drop, analytics e integracao com CRMs.",
      description:
        "FormKit e uma plataforma no-code para criacao de formularios inteligentes. Monte formularios com drag-and-drop, publique em segundos e acompanhe respostas em tempo real.",
      category: "APP_WEB",
      projectType: "SaaS",
      status: "MVP",
      approvalStatus: "APROVADO",
      price: 15000,
      acceptsOffers: true,
      monthlyRevenue: 800,
      monthlyCosts: 150,
      usersCount: 89,
      demoUrl: "https://formkit-demo.vercel.app",
      techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
      includedAssets: ["CODIGO_FONTE", "DOMINIO", "MARCA", "DOCUMENTACAO", "BANCO_DADOS"],
      screenshots: ["https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"],
      reasonForSelling: "Preciso focar em projetos maiores.",
      isFeatured: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log("Seed concluido.");
  console.log(`Perfis: ${profiles.length}`);
  console.log(`Projetos: ${projects.length}`);
  console.log("Para login real, crie usuarios no Supabase Auth com os mesmos emails se quiser usar estes perfis.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
