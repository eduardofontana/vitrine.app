# Vitrine App

Marketplace brasileiro para devs venderem micro-SaaS, apps prontos, templates,
landing pages e side projects.

## Stack

- Next.js 15 com App Router
- TypeScript
- Tailwind CSS + componentes estilo shadcn/ui
- Supabase Auth com email/senha, Google e GitHub
- Supabase Postgres via Prisma
- Zod para validacao

## Configuracao

Crie um projeto no Supabase e configure Google/GitHub em Auth > Providers.
Depois preencha `.env` com os valores reais:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxx"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

No painel do Supabase, use a opcao `ORM > Prisma` em `Connect`:

- `DATABASE_URL`: shared transaction-mode pooler, porta `6543`, com `?pgbouncer=true`.
- `DIRECT_URL`: shared session-mode pooler, porta `5432`, usada por migrations e `db:push`.

## Rodando

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Acesse `http://localhost:3000`.

## Fluxos

- Login e cadastro por email/senha via Supabase Auth.
- Login social por Google e GitHub.
- Perfis locais em `profiles`, ligados ao UUID do usuario Supabase.
- Projetos novos entram como `PENDENTE`.
- Admin precisa de `profiles.role = "ADMIN"` para acessar curadoria.
- Marketplace mostra apenas projetos `APROVADO`.
- Leads so podem ser criados para projetos aprovados.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
npm run db:studio
```
