import { z } from "zod";

const limitedText = (min: number, max: number, field: string) =>
  z
    .string()
    .trim()
    .min(min, `${field} deve ter no minimo ${min} caracteres`)
    .max(max, `${field} deve ter no maximo ${max} caracteres`);

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalido").max(254, "Email muito longo"),
  password: z.string().min(6, "Minimo de 6 caracteres").max(128, "Senha muito longa"),
});

export const registerSchema = z.object({
  name: limitedText(2, 80, "Nome"),
  email: z.string().trim().email("Email invalido").max(254, "Email muito longo"),
  username: z
    .string()
    .trim()
    .min(3, "Username deve ter no minimo 3 caracteres")
    .max(32, "Username deve ter no maximo 32 caracteres")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minusculas, numeros e _"),
  password: z.string().min(8, "Minimo de 8 caracteres").max(128, "Senha muito longa"),
});

const optionalUrl = z
  .string()
  .trim()
  .url("URL invalida")
  .max(2048, "URL muito longa")
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), {
    message: "Use apenas URLs http ou https",
  })
  .optional()
  .or(z.literal(""));

const limitedStringArray = z
  .array(z.string().trim().min(1).max(40))
  .max(20, "Informe no maximo 20 itens")
  .default([]);

export const projectSchema = z.object({
  name: limitedText(3, 100, "Nome"),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug invalido"),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Minimo de 10 caracteres")
    .max(200, "Maximo de 200 caracteres"),
  description: limitedText(20, 5000, "Descricao"),
  category: z.enum([
    "MICRO_SAAS",
    "APP_WEB",
    "APP_MOBILE",
    "LANDING_PAGE",
    "TEMPLATE",
    "AUTOMACAO",
    "BOT",
    "API",
    "E_COMMERCE",
    "EXTENSAO",
    "OUTRO",
  ]),
  projectType: z.string().trim().max(60, "Tipo de projeto muito longo").optional(),
  status: z.enum([
    "IDEIA_VALIDADA",
    "MVP",
    "EM_PRODUCAO",
    "COM_USUARIOS",
    "COM_RECEITA",
    "PAUSADO",
    "PRONTO_PARA_VENDA",
  ]),
  price: z.coerce.number().finite().min(0, "Preco nao pode ser negativo").max(100000000),
  acceptsOffers: z.boolean().default(true),
  monthlyRevenue: z.coerce.number().finite().min(0).max(100000000).default(0),
  monthlyCosts: z.coerce.number().finite().min(0).max(100000000).default(0),
  usersCount: z.coerce.number().int().min(0).max(100000000).default(0),
  demoUrl: optionalUrl,
  websiteUrl: optionalUrl,
  screenshotUrl: optionalUrl,
  repositoryInfo: z.string().trim().max(1000, "Informacao muito longa").optional(),
  techStack: limitedStringArray,
  includedAssets: limitedStringArray,
  reasonForSelling: z.string().trim().max(1000, "Motivo muito longo").optional(),
});

export const leadSchema = z.object({
  projectId: z.string().min(1).max(64),
  buyerName: limitedText(2, 80, "Nome"),
  buyerEmail: z.string().trim().email("Email invalido").max(254, "Email muito longo"),
  message: limitedText(10, 2000, "Mensagem"),
  interestType: z.enum(["QUERO_COMPRAR", "QUERO_NEGOCIAR", "QUERO_SABER_MAIS"]),
  offerAmount: z.coerce.number().finite().min(0).max(100000000).optional(),
});

export const profileSchema = z.object({
  name: limitedText(2, 80, "Nome"),
  username: z
    .string()
    .trim()
    .min(3, "Username deve ter no minimo 3 caracteres")
    .max(32, "Username deve ter no maximo 32 caracteres")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minusculas, numeros e _"),
  bio: z.string().trim().max(800, "Bio deve ter no maximo 800 caracteres").optional(),
  avatarUrl: optionalUrl,
  skills: limitedStringArray,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
