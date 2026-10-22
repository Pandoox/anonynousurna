let store = global.__URNA_STORE__;
if(!store){
  global.__URNA_STORE__ = { "13":0,"22":0,"branco":0,"nulo":0,"total":0,"ips":[],"logs":[] };
  store = global.__URNA_STORE__;
}
let kv = null;
try{ kv = require('@vercel/kv'); }catch{}

module.exports = async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();

  if(req.method==='GET') return res.json(store);

  const { voto, ip } = req.body || {};
  const realIp = (req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || ip || 'unknown').trim();

  if(!['13','22','branco','nulo'].includes(voto)){
    return res.status(400).json({error:'voto invalido'});
  }

  // Tenta pegar do KV se tiver
  let dados = store;
  if(kv && process.env.KV_REST_API_URL){
    try{
      const fromKv = await kv.kv.get('urna:votos');
      if(fromKv) { dados = fromKv; global.__URNA_STORE__ = dados; }
    }catch(e){}
  }

  dados.ips = dados.ips || [];
  if(dados.ips.includes(realIp)){
    return res.status(403).json({error:'IP já votou', ip: realIp, placar: dados});
  }

  dados[voto] = (dados[voto]||0)+1;
  dados.total = (dados.total||0)+1;
  dados.ips.push(realIp);
  dados.logs = dados.logs || [];
  dados.logs.unshift({ ip: realIp, voto, data: new Date().toISOString(), hora: new Date().toLocaleString('pt-BR') });
  dados.logs = dados.logs.slice(0,200);

  // Salva no KV se tiver, senão fica na memória global
  if(kv && process.env.KV_REST_API_URL){
    try{ await kv.kv.set('urna:votos', dados); }catch(e){}
  }
  global.__URNA_STORE__ = dados;

  res.json({ok:true, placar: dados, ip: realIp});
}
