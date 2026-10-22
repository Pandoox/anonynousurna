let kv=null; try{kv=require('@vercel/kv')}catch{}
let mem=global.__URNA__||={"13":0,"22":0,branco:0,nulo:0,total:0,ips:[],logs:[]}
global.__URNA__=mem
module.exports=async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Cache-Control','no-store')
  if(kv&&process.env.KV_REST_API_URL){
    const d=await kv.kv.get('urna:votos'); if(d) return res.json(d)
  }
  res.json(mem)
}
