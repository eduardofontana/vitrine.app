export function authErrorMessage(message?: string) {
  const normalized = message?.toLowerCase() || "";

  if (normalized.includes("email not confirmed")) {
    return "Se uma conta com este email existir, voce recebera as instrucoes de confirmacao.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email ou senha invalidos. Confira os dados ou crie uma nova conta.";
  }

  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "Se uma conta com este email existir, voce recebera as instrucoes de acesso.";
  }

  if (normalized.includes("password")) {
    return "A senha precisa atender aos requisitos. Use pelo menos 8 caracteres, incluindo maiuscula, minuscula e numero.";
  }

  if (normalized.includes("provider is not enabled")) {
    return "Este login social ainda nao esta habilitado.";
  }

  return "Nao foi possivel concluir a autenticacao. Tente novamente.";
}
