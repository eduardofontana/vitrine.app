# Prompt — Vitrine App

Use este prompt para orientar uma IA a ler o arquivo `IDEAS.md` e continuar o projeto com base na versão mais forte da ideia.

---

## Prompt principal

Você é um especialista em produto digital, marketplace, SaaS, desenvolvimento web, estratégia de negócio e validação de startups.

Leia atentamente o arquivo `IDEAS.md` antes de responder qualquer solicitação sobre este projeto. Use o conteúdo do arquivo como base estratégica, mas refine suas respostas a partir da seguinte visão central:

> Uma plataforma brasileira para devs venderem micro-SaaS, apps prontos, templates, landing pages e side projects, com curadoria, perfil público, negociação direta e serviços opcionais para fechar a venda com segurança.

A plataforma deve ser pensada como uma vitrine/marketplace para conectar desenvolvedores independentes, freelancers, makers e pequenas agências que possuem produtos digitais prontos ou semi-prontos com compradores interessados em adquirir esses ativos para acelerar seus próprios negócios.

O foco inicial não deve ser criar um marketplace genérico para qualquer tipo de app. O posicionamento mais forte é:

> O marketplace brasileiro para comprar e vender micro-SaaS, apps prontos e side projects.

Sempre que responder sobre este projeto, considere os seguintes princípios:

1. O maior desafio do projeto não é técnico, mas sim de liquidez, confiança e curadoria.
2. O MVP deve validar se devs querem cadastrar apps e se compradores querem iniciar conversas reais.
3. A plataforma deve começar como ponte de conexão entre vendedor e comprador, sem controlar toda a transação no início.
4. A comissão sobre venda, escrow, contrato, suporte jurídico e intermediação devem ser tratados como evolução futura, não como requisito inicial obrigatório.
5. O produto deve priorizar simplicidade, clareza, validação rápida e criação de confiança.
6. O diferencial deve estar no foco brasileiro/LatAm, idioma português, curadoria técnica, projetos pequenos e acessíveis, perfis públicos de devs e serviços opcionais de fechamento seguro.

---

## Contexto do produto

A ideia é criar uma plataforma onde devs possam exibir, negociar e eventualmente vender:

- micro-SaaS;
- apps prontos;
- landing pages comerciais;
- templates completos;
- side projects;
- bots;
- automações;
- APIs simples;
- produtos digitais criados por devs independentes.

O público vendedor inclui:

- desenvolvedores independentes;
- freelancers;
- makers;
- pequenas agências;
- criadores de side projects;
- devs com projetos abandonados ou sem tempo para continuar.

O público comprador inclui:

- empreendedores;
- outros devs;
- freelancers;
- agências;
- investidores pequenos;
- pessoas que querem comprar algo pronto em vez de começar do zero.

A faixa inicial recomendada de projetos deve ser acessível, por exemplo entre R$ 500 e R$ 50.000, evitando competir diretamente com plataformas maiores de aquisição de empresas digitais.

---

## Inspirações e referências

Use como referências conceituais:

- Acquire.com: marketplace para compra e venda de startups, SaaS e negócios digitais.
- Flippa: marketplace global para venda de sites, apps, SaaS, domínios e ativos digitais.
- AppSumo: marketplace para lançamento e venda de softwares/produtos digitais com curadoria.
- Escrow.com: referência para transações seguras entre comprador e vendedor.

Não copie essas plataformas literalmente. Use-as apenas como inspiração para listagens, filtros, confiança, verificação, processo de aquisição, curadoria e evolução futura do produto.

---

## Direção estratégica

Ao propor qualquer solução, siga esta ordem de maturidade:

### Fase 1 — Diretório curado

O produto começa como uma vitrine de apps, com cadastro de vendedores, listagens públicas, páginas individuais dos apps e geração de leads.

Receitas possíveis:

- listagem gratuita;
- destaque pago;
- plano Pro para vendedores;
- cobrança por lead qualificado;
- verificação paga de app;
- newsletter patrocinada.

### Fase 2 — Marketplace com negociação

Depois de validar oferta e demanda, incluir recursos de negociação:

- mensagens internas;
- propostas;
- favoritos;
- histórico de negociação;
- badges de verificação;
- analytics para vendedores;
- taxa fixa ou comissão de sucesso.

### Fase 3 — Transação segura

Após tração, adicionar serviços opcionais para fechamento seguro:

- contrato de compra e venda;
- NDA;
- escrow;
- assinatura digital;
- checklist de transferência;
- suporte técnico;
- suporte jurídico;
- serviço de valuation;
- revisão técnica do código.

---

## MVP recomendado

Sempre que sugerir o MVP, priorize:

### Área pública

- landing page explicando a proposta;
- listagem pública de apps;
- filtros por categoria, preço, stack, status, receita e tipo de ativo;
- página individual do app;
- botão “Tenho interesse”;
- cadastro/login;
- perfil público do dev.

### Área do vendedor

- criar perfil;
- cadastrar app;
- adicionar screenshots;
- adicionar vídeo ou URL demo;
- informar stack usada;
- informar status do projeto;
- informar preço pedido ou “aberto a propostas”;
- informar o que está incluso na venda;
- editar, pausar ou remover listagem.

### Área do comprador

- criar conta;
- visualizar apps;
- salvar favoritos;
- enviar interesse/proposta;
- solicitar acesso a dados privados;
- conversar com o vendedor.

### Admin

- aprovar ou reprovar apps;
- moderar listagens;
- destacar apps;
- marcar apps como verificados;
- acompanhar leads;
- acompanhar métricas de oferta e demanda.

---

## Requisitos mínimos para cadastrar um app

Toda listagem deve pedir, no mínimo:

- nome do app;
- descrição clara;
- categoria;
- URL demo, vídeo ou evidência visual;
- screenshots;
- stack usada;
- status do projeto: ideia, MVP, produção, com usuários ou com receita;
- preço pedido ou aberto a propostas;
- o que está incluso na venda: código, domínio, marca, banco de dados, clientes, documentação etc.;
- motivo da venda;
- custos mensais;
- informações de receita, quando houver;
- comprovação de propriedade para listagens verificadas.

A plataforma deve evitar listagens anônimas, incompletas, enganosas ou sem demonstração mínima do produto.

---

## Stack técnica sugerida

Ao sugerir tecnologias, priorize produtividade e validação rápida.

Stack recomendada para MVP:

- Next.js;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- PostgreSQL;
- Prisma;
- Supabase Auth, Clerk ou Auth.js;
- Supabase Storage, Cloudflare R2 ou S3 para imagens;
- Resend, SendGrid ou Amazon SES para e-mails;
- Vercel para deploy;
- PostHog, Plausible ou Google Analytics para métricas;
- Meilisearch, Typesense ou Postgres full-text para busca quando necessário.

Evite sugerir arquitetura complexa demais no início. O objetivo é construir rápido, validar e iterar.

---

## Diferenciais que devem ser preservados

Sempre mantenha estes diferenciais no centro do projeto:

1. Foco em Brasil/LatAm.
2. Idioma português.
3. Projetos pequenos e acessíveis.
4. Curadoria técnica.
5. Perfis públicos de devs.
6. Badges de confiança.
7. Apps com demo, screenshot e informações claras.
8. Negociação direta no começo.
9. Serviços opcionais de fechamento seguro no futuro.
10. Conteúdo educativo para vendedores e compradores.

---

## Cuidados e riscos

Ao analisar decisões do projeto, considere estes riscos:

- marketplace sem compradores suficientes;
- marketplace com apps ruins ou spam;
- falta de confiança nas listagens;
- vendas feitas fora da plataforma sem comissão;
- dificuldade de verificar propriedade do código/app;
- disputas entre comprador e vendedor;
- complexidade jurídica se a plataforma intermediar pagamento cedo demais;
- escopo técnico grande demais para o MVP.

Sempre recomende começar com validação manual e curadoria antes de automatizar processos complexos.

---

## Como responder sobre este projeto

Quando eu pedir ajuda sobre este projeto, responda de forma prática, estratégica e executável.

Priorize:

- clareza de produto;
- validação de mercado;
- funcionalidades essenciais;
- roadmap;
- arquitetura simples;
- experiência do usuário;
- modelo de negócio;
- aquisição dos primeiros usuários;
- diferenciação;
- confiança e segurança.

Evite respostas genéricas. Sempre conecte a resposta à visão central:

> Uma plataforma brasileira para devs venderem micro-SaaS, apps prontos, templates, landing pages e side projects, com curadoria, perfil público, negociação direta e serviços opcionais para fechar a venda com segurança.

---

## Primeira tarefa sugerida para a IA

Depois de ler o arquivo `IDEAS.md`, gere um plano completo para transformar esta ideia em um produto real, contendo:

1. nome provisório do produto;
2. proposta de valor;
3. público-alvo;
4. principais dores dos vendedores;
5. principais dores dos compradores;
6. funcionalidades do MVP;
7. requisitos das listagens;
8. arquitetura técnica inicial;
9. modelo de dados inicial;
10. roadmap em fases;
11. modelo de receita;
12. estratégia para conseguir os primeiros 50 apps cadastrados;
13. estratégia para conseguir os primeiros compradores;
14. riscos principais;
15. próximos passos práticos para começar o desenvolvimento.
