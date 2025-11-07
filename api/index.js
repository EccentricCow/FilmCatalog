export default async (req, res) => {
  const { reqHandler } = await import('../dist/film-catalog/server/server.mjs');
  return reqHandler(req, res);
};
