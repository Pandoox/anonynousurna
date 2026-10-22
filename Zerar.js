module.exports = async (req,res)=>{
  if(req.body?.senha !== 'anonymous2026'){
    return res.status(403).json({error:'senha invalida'});
  }
  const zerado = {"13":0,"22":0,"branco":0,"nulo":0,"total":0,"ips":[],"logs":[]};
  global.__URNA_STORE__ = zerado;
  try{
    const { kv } = require('@vercel/kv');
    if(process.env.KV_REST_API_URL) await kv.set('urna:votos', zerado);
  }catch{}
  res.json(zerado);
}
