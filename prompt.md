Você é uma IA desenvolvedora full-stack sênior. Leia atentamente o arquivo `vitrine-app.md` antes de escrever qualquer código.

O objetivo é desenvolver o MVP de uma plataforma chamada **Vitrine App**: uma plataforma brasileira para devs venderem micro-SaaS, apps prontos, templates, landing pages e side projects, com curadoria, perfil público, negociação direta e serviços opcionais para fechar a venda com segurança.

Use o conteúdo do arquivo `vitrine-app.md` como documento principal de produto, estratégia, posicionamento e requisitos. A partir dele, desenvolva uma aplicação web moderna, funcional, escalável e bem organizada.

## Objetivo do projeto

Criar um marketplace/vitrine onde desenvolvedores possam cadastrar projetos digitais à venda e compradores possam explorar, filtrar, visualizar detalhes e demonstrar interesse.

A plataforma deve começar como uma ponte entre vendedor e comprador, sem intermediar pagamento no MVP. A venda segura, comissão, escrow, contratos e verificação avançada devem ser pensados como evolução futura, mas a arquitetura precisa permitir essa expansão.

## Stack recomendada

Use preferencialmente:

* Next.js com App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Prisma ORM
* PostgreSQL
* Auth.js ou sistema de autenticação equivalente
* Zod para validações
* React Hook Form para formulários
* Estrutura limpa, modular e fácil de evoluir

Caso o projeto já tenha uma stack inicial configurada, respeite a estrutura existente e evolua sobre ela.

## Funcionalidades do MVP

Implemente as seguintes áreas:

### 1. Landing page pública

Criar uma página inicial clara e persuasiva com:

* Hero section com proposta de valor
* Explicação do serviço
* Benefícios para vendedores
* Benefícios para compradores
* Cards de apps/projetos em destaque
* Seção “Como funciona”
* Seção de confiança/curadoria
* Chamada para ação:

  * “Explorar projetos”
  * “Anunciar meu projeto”

Use o posicionamento:

“Compre e venda apps prontos com segurança.”

E também comunique:

“O marketplace brasileiro para devs venderem micro-SaaS, apps prontos, templates, landing pages e side projects.”

### 2. Marketplace de projetos

Criar uma página pública `/marketplace` com listagem de projetos.

Cada projeto deve exibir:

* Nome
* Descrição curta
* Categoria
* Preço ou “Aberto a propostas”
* Status do projeto
* Stack principal
* Indicação se possui receita, usuários ou demo
* Imagem/screenshot placeholder
* Botão “Ver detalhes”

Filtros desejáveis:

* Categoria
* Tipo de projeto
* Faixa de preço
* Status
* Stack
* Possui receita
* Possui demo

No MVP, os dados podem começar mockados ou seedados via Prisma, mas a estrutura deve estar pronta para dados reais.

### 3. Página de detalhes do projeto

Criar uma página `/projetos/[slug]` com:

* Nome do projeto
* Pitch curto
* Descrição completa
* Galeria ou screenshots
* URL de demo, se existir
* Categoria
* Tipo de projeto
* Stack utilizada
* Status
* Preço pedido
* Receita mensal, se informada
* Custos mensais, se informados
* Número de usuários, se informado
* O que está incluso na venda:

  * código-fonte
  * domínio
  * marca
  * documentação
  * clientes
  * banco de dados
* Motivo da venda
* Perfil resumido do vendedor
* Botão “Tenho interesse”
* Aviso de que a negociação é direta entre comprador e vendedor

### 4. Autenticação

Criar sistema de login/cadastro.

Usuários devem ter pelo menos:

* id
* nome
* email
* avatar opcional
* bio opcional
* tipo de perfil:

  * vendedor
  * comprador
  * ambos
* data de criação

### 5. Perfil público do dev

Criar página `/devs/[username]` com:

* Nome
* Username
* Bio
* Skills
* Links opcionais
* Projetos publicados
* Badges ou indicadores futuros:

  * dev verificado
  * projetos publicados
  * projetos vendidos

### 6. Cadastro de projeto

Criar área protegida para o usuário cadastrar um projeto.

Rota sugerida:

`/dashboard/projetos/novo`

Campos mínimos:

* Nome do projeto
* Slug
* Descrição curta
* Descrição completa
* Categoria
* Tipo de projeto
* Status
* Stack
* URL demo
* URL do site
* URL do repositório privado ou observação sobre código
* Preço pedido
* Aceita propostas?
* Receita mensal
* Custos mensais
* Número de usuários
* O que está incluso na venda
* Motivo da venda
* Screenshots ou placeholders

Ao cadastrar, o projeto deve ficar com status interno:

* pendente
* aprovado
* rejeitado

No marketplace público, exibir apenas projetos aprovados.

### 7. Dashboard do usuário

Criar `/dashboard` com:

* Resumo dos projetos cadastrados
* Status de cada projeto
* Quantidade de visualizações mockada ou futura
* Quantidade de interessados/leads
* Ações:

  * editar projeto
  * visualizar página pública
  * cadastrar novo projeto

### 8. Interesse/proposta

Criar fluxo simples para comprador demonstrar interesse.

Na página do projeto, o botão “Tenho interesse” deve abrir formulário com:

* Nome
* Email
* Mensagem
* Tipo de interesse:

  * quero comprar
  * quero negociar
  * quero saber mais
* Valor de proposta opcional

Salvar o lead/interesse no banco ou, se o banco ainda não estiver pronto, estruturar o código para isso.

O vendedor deve conseguir ver os interessados no dashboard.

### 9. Admin/curadoria

Criar uma base para painel administrativo:

`/admin`

Funcionalidades:

* Listar projetos pendentes
* Aprovar projeto
* Rejeitar projeto
* Marcar como destaque
* Marcar badges:

  * demo verificada
  * código verificado
  * receita verificada
  * venda segura disponível

Se autenticação/admin real ainda não estiver implementado, deixe a estrutura preparada e protegida com uma verificação simples.

## Modelo de dados sugerido

Crie modelos equivalentes a:

### User

* id
* name
* email
* username
* avatarUrl
* bio
* role
* createdAt
* updatedAt

### Project

* id
* ownerId
* name
* slug
* shortDescription
* description
* category
* projectType
* status
* approvalStatus
* price
* acceptsOffers
* monthlyRevenue
* monthlyCosts
* usersCount
* demoUrl
* websiteUrl
* repositoryInfo
* techStack
* includedAssets
* reasonForSelling
* screenshots
* isFeatured
* hasVerifiedDemo
* hasVerifiedCode
* hasVerifiedRevenue
* hasSecureSale
* createdAt
* updatedAt

### Lead

* id
* projectId
* buyerName
* buyerEmail
* message
* interestType
* offerAmount
* createdAt

## Categorias iniciais

Use categorias como:

* Micro-SaaS
* App Web
* App Mobile
* Landing Page
* Template
* Automação
* Bot
* API
* E-commerce
* Extensão
* Outro

## Status do projeto

Use status como:

* Ideia validada
* MVP
* Em produção
* Com usuários
* Com receita
* Pausado
* Pronto para venda

## Direção visual

A identidade deve seguir a ideia de marca moderna, confiável e tecnológica.

Use como base:

* Azul escuro para confiança
* Verde/teal para crescimento, venda e tecnologia
* Branco/cinza claro para limpeza
* Roxo ou azul vivo como cor de apoio

Estilo:

* moderno
* limpo
* startup brasileira
* confiável
* com cards bem definidos
* bastante espaço em branco
* boa hierarquia visual

Nome da marca: **Vitrine App**

Tagline: **Compre e venda apps prontos com segurança.**

## Requisitos técnicos

* Código limpo e tipado
* Componentes reutilizáveis
* Separar regras de negócio de UI quando possível
* Usar validações com Zod
* Evitar duplicação
* Criar seed de projetos exemplo
* Criar README com instruções para rodar o projeto
* Criar `.env.example`
* Garantir responsividade mobile e desktop
* Usar boas práticas de acessibilidade
* Não criar funcionalidades falsas sem deixar claro que são placeholders ou futuras

## Entregáveis esperados

Ao finalizar, entregue:

1. Estrutura inicial do projeto funcionando
2. Landing page
3. Marketplace
4. Página de projeto
5. Login/cadastro ou estrutura preparada
6. Dashboard básico
7. Cadastro de projeto
8. Fluxo de interesse
9. Modelo de banco com Prisma
10. Seed com projetos fictícios
11. README explicando:

    * como instalar
    * como configurar `.env`
    * como rodar migrations
    * como rodar seed
    * como iniciar o servidor
    * próximas melhorias sugeridas

## Critérios de qualidade

Antes de finalizar:

* Verifique erros de TypeScript
* Verifique erros de lint
* Verifique rotas quebradas
* Confirme que os principais fluxos funcionam
* Garanta que o projeto rode localmente
* Garanta que a UI esteja minimamente bonita e coerente com a proposta
* Não deixe código morto ou arquivos desnecessários

## Forma de trabalho

Primeiro, leia `vitrine-app.md`.

Depois, faça uma breve análise do que será implementado.

Em seguida, implemente o projeto por etapas:

1. Estrutura e dependências
2. Layout global e tema
3. Modelagem do banco
4. Seeds
5. Landing page
6. Marketplace
7. Detalhes do projeto
8. Autenticação/usuário
9. Dashboard
10. Cadastro de projeto
11. Leads/interesse
12. Admin básico
13. README e ajustes finais

Tome decisões técnicas sensatas sem pedir confirmação a cada passo. Quando houver ambiguidade, escolha a alternativa mais simples, escalável e adequada para um MVP real.

Desenvolva o projeto como se ele fosse virar um produto real.
