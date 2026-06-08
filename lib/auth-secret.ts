export function getAuthSecret() {
  return getAuthSecrets()[0];
}

export function getAuthSecrets() {
  const secrets = [process.env.AUTH_SECRET, process.env.NEXTAUTH_SECRET]
    .map((secret) => secret?.trim())
    .filter((secret): secret is string => Boolean(secret));

  return Array.from(new Set(secrets));
}
