export const accountCreatedMessage = 'Conta criada com sucesso, faca o login normalmente.';
export const accountCreatedMessageKey = 'sendflow:account-created-message';

const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Este email ja esta cadastrado.',
  'auth/invalid-credential': 'Email ou senha invalidos.',
  'auth/invalid-email': 'Informe um email valido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
};

export const getAuthErrorMessage = (error: unknown) => {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  return authErrorMessages[code] ?? 'Nao foi possivel concluir a autenticacao.';
};
