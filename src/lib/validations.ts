import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Minimo de 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
  email: z.string().email("Email invalido"),
  username: z
    .string()
    .min(3, "Username deve ter no minimo 3 caracteres")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minusculas, numeros e _"),
  password: z.string().min(6, "Minimo de 6 caracteres"),
});

const optionalUrl = z
  .string()
  .trim()
  .url("URL invalida")
  .optional()
  .or(z.literal(""));

export const projectSchema = z.object({
  name: z.string().min(3, "Nome deve ter no minimo 3 caracteres"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug invalido"),
  shortDescription: z
    .string()
    .min(10, "Minimo de 10 caracteres")
    .max(200, "Maximo de 200 caracteres"),
  description: z.string().min(20, "Minimo de 20 caracteres"),
  category: z.string().min(1, "Categoria obrigatoria"),
  projectType: z.string().optional(),
  status: z.string().min(1, "Status obrigatorio"),
  price: z.coerce.number().min(0, "Preco nao pode ser negativo"),
  acceptsOffers: z.boolean().default(true),
  monthlyRevenue: z.coerce.number().min(0).default(0),
  monthlyCosts: z.coerce.number().min(0).default(0),
  usersCount: z.coerce.number().int().min(0).default(0),
  demoUrl: optionalUrl,
  websiteUrl: optionalUrl,
  screenshotUrl: optionalUrl,
  repositoryInfo: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  includedAssets: z.array(z.string()).default([]),
  reasonForSelling: z.string().optional(),
});

export const leadSchema = z.object({
  projectId: z.string().min(1),
  buyerName: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
  buyerEmail: z.string().email("Email invalido"),
  message: z.string().min(10, "Minimo de 10 caracteres"),
  interestType: z.enum(["QUERO_COMPRAR", "QUERO_NEGOCIAR", "QUERO_SABER_MAIS"]),
  offerAmount: z.coerce.number().min(0).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
