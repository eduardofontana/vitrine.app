export function authErrorMessage(message?: string) {
  const normalized = message?.toLowerCase() || "";

  if (normalized.includes("email not confirmed")) {
    return "Confirme seu email antes de entrar. Verifique sua caixa de entrada.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email ou senha invalidos. Confira os dados ou crie uma nova conta.";
  }

  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "Este email ja esta cadastrado. Tente entrar ou recupere o acesso.";
  }

  if (normalized.includes("password")) {
    return "A senha precisa atender aos requisitos do Supabase. Use pelo menos 8 caracteres.";
  }

  if (normalized.includes("provider is not enabled")) {
    return "Este login social ainda nao esta habilitado no Supabase.";
  }

  return "Nao foi possivel concluir a autenticacao. Tente novamente.";
}
