# Vitrine App

Marketplace brasileiro para devs venderem micro-SaaS, apps prontos, templates,
landing pages e side projects.

## Licenca e uso comercial

Este repositorio e publico, mas **nao e open source para uso comercial**.
O codigo esta disponivel para estudo, avaliacao, auditoria, testes privados e
contribuicoes nao comerciais.

Qualquer uso comercial, incluindo deploy publico, produto SaaS, marketplace,
template pago, projeto de cliente, white-label, revenda ou uso interno em uma
empresa, exige uma licenca comercial paga e permissao previa por escrito.

Consulte [LICENSE](./LICENSE) antes de usar, copiar, modificar, hospedar ou
distribuir este projeto.

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

## Google AdSense e metricas

O projeto ja inclui a configuracao do Google AdSense para o publisher:

```txt
ca-pub-2572298012241654
```

Foram adicionados:

- `<meta name="google-adsense-account" content="ca-pub-2572298012241654">`.
- Script global do AdSense via `next/script`.
- `public/ads.txt` com:

```txt
google.com, pub-2572298012241654, DIRECT, f08c47fec0942fa0
```

No Google AdSense, cadastre o dominio de producao do projeto e use o publisher
`pub-2572298012241654`. O arquivo deve ficar acessivel em `/ads.txt` apos o
deploy.

Para metricas de produto, o projeto usa Vercel Analytics e eventos customizados:

- `Lead Started`
- `Lead Submitted`
- `Project Created`
- `Signup Started`
- `Signup Completed`
- `Login Completed`
- `Social Auth Started`

Os eventos nao enviam dados pessoais como nome, email ou mensagem do lead.

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

## Licenca

Copyright (c) 2026 Eduardo Fontana.

Distribuido sob a **Vitrine App Source-Available Non-Commercial License**.
Uso comercial nao autorizado e proibido. Para uso comercial, solicite uma
licenca paga antes de usar o projeto.
