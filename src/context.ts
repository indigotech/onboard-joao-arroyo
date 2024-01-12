export async function context({ req }) {
  const token: string = req.headers.authorization || '';
  return { token: token };
}
