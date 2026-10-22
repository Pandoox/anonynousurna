const fs = require('fs');
const path = require('path');
module.exports = (req, res) => {
  // serve index.html from root
  try{
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.send(html);
  }catch(e){
    res.status(500).send('index.html não encontrado. Coloque seu HTML na raiz.');
  }
}
