import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const profiles = await Promise.all([
    prisma.profile.upsert({
      where: { email: "seller-alpha@example.com" },
      update: {},
      create: {
        id: "11111111-1111-4111-8111-111111111111",
        name: "Demo Seller Alpha",
        email: "seller-alpha@example.com",
        username: "demo_seller_alpha",
        bio: "Perfil demonstrativo de vendedor. Dados ficticios usados apenas para popular o ambiente de demo.",
        skills: ["React", "Node.js", "Python", "PostgreSQL", "Docker"],
        role: "USER",
      },
    }),
    prisma.profile.upsert({
      where: { email: "seller-beta@example.com" },
      update: {},
      create: {
        id: "22222222-2222-4222-8222-222222222222",
        name: "Demo Seller Beta",
        email: "seller-beta@example.com",
        username: "demo_seller_beta",
        bio: "Perfil demonstrativo de maker mobile. Dados ficticios usados apenas para exemplos de marketplace.",
        skills: ["React Native", "TypeScript", "Firebase", "UX", "Stripe"],
        role: "USER",
      },
    }),
    prisma.profile.upsert({
      where: { email: "seller-gamma@example.com" },
      update: {},
      create: {
        id: "33333333-3333-4333-8333-333333333333",
        name: "Demo Seller Gamma",
        email: "seller-gamma@example.com",
        username: "demo_seller_gamma",
        bio: "Perfil demonstrativo de indie hacker. Dados ficticios para testar filtros, cards e paginas publicas.",
        skills: ["Next.js", "Python", "Automacao", "APIs", "Supabase"],
        role: "USER",
      },
    }),
    prisma.profile.upsert({
      where: { email: "admin@example.com" },
      update: { role: "ADMIN" },
      create: {
        id: "44444444-4444-4444-8444-444444444444",
        name: "Demo Admin",
        email: "admin@example.com",
        username: "demo_admin",
        skills: ["Curadoria", "Produto", "Seguranca"],
        role: "ADMIN",
      },
    }),
  ]);

  const projects = [
    {
      ownerId: profiles[0].id,
      name: "Demo TaskFlow",
      slug: "demo-taskflow",
      shortDescription:
        "Projeto demonstrativo de gestao de tarefas com kanban, time tracking e relatorios.",
      description:
        "Demo TaskFlow e um exemplo ficticio de plataforma de gestao de tarefas e projetos. Os numeros, links e metricas existem apenas para demonstrar a experiencia do marketplace.",
      category: "MICRO_SAAS",
      projectType: "SaaS",
      status: "COM_RECEITA",
      approvalStatus: "APROVADO",
      price: 45000,
      acceptsOffers: true,
      monthlyRevenue: 3200,
      monthlyCosts: 480,
      usersCount: 230,
      demoUrl: "https://demo-taskflow.example.com",
      websiteUrl: "https://demo-taskflow.example.com",
      repositoryInfo: "Informacao demonstrativa. Nenhum repositorio real esta incluso neste seed.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker"],
      includedAssets: ["CODIGO_FONTE", "DOMINIO", "MARCA", "DOCUMENTACAO", "BANCO_DADOS"],
      screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"],
      reasonForSelling: "Motivo ficticio usado apenas para demonstrar o campo de venda.",
      isFeatured: true,
      hasVerifiedDemo: true,
      hasVerifiedRevenue: true,
      hasSecureSale: true,
    },
    {
      ownerId: profiles[1].id,
      name: "Demo PlantCare",
      slug: "demo-plantcare",
      shortDescription:
        "Projeto demonstrativo de app mobile para plantas, lembretes e comunidade.",
      description:
        "Demo PlantCare e um exemplo ficticio de aplicativo mobile para jardinagem. Todos os dados de usuarios, receita e ativos sao simulados para testes.",
      category: "APP_MOBILE",
      projectType: "Mobile App",
      status: "COM_USUARIOS",
      approvalStatus: "APROVADO",
      price: 28000,
      acceptsOffers: true,
      monthlyRevenue: 1500,
      monthlyCosts: 200,
      usersCount: 3400,
      demoUrl: "https://demo-plantcare.example.com",
      repositoryInfo: "Codigo-fonte ficticio descrito apenas para demonstracao.",
      techStack: ["React Native", "TypeScript", "Firebase", "Stripe", "ML Kit"],
      includedAssets: ["CODIGO_FONTE", "MARCA", "CLIENTES", "DOCUMENTACAO"],
      screenshots: ["https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80"],
      reasonForSelling: "Motivo ficticio usado apenas para demonstracao do marketplace.",
      isFeatured: true,
      hasVerifiedCode: true,
    },
    {
      ownerId: profiles[2].id,
      name: "Demo FormKit",
      slug: "demo-formkit",
      shortDescription:
        "Projeto demonstrativo de gerador de formularios com drag-and-drop e analytics.",
      description:
        "Demo FormKit e um exemplo ficticio de plataforma no-code para formularios. Os detalhes comerciais sao simulados e existem apenas para popular telas de exemplo.",
      category: "APP_WEB",
      projectType: "SaaS",
      status: "MVP",
      approvalStatus: "APROVADO",
      price: 15000,
      acceptsOffers: true,
      monthlyRevenue: 800,
      monthlyCosts: 150,
      usersCount: 89,
      demoUrl: "https://demo-formkit.example.com",
      techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
      includedAssets: ["CODIGO_FONTE", "DOMINIO", "MARCA", "DOCUMENTACAO", "BANCO_DADOS"],
      screenshots: ["https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"],
      reasonForSelling: "Motivo ficticio usado apenas para demonstrar a listagem.",
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
  console.log("Dados seedados sao demonstrativos e nao representam usuarios, projetos ou negocios reais.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
