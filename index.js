const http = require('http');
const fs = require('fs');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate')

const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`,'utf-8');

const tempCard = fs.readFileSync(`${__dirname}/template/template-card.html`,'utf-8');

const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');

const dataObj = JSON.parse(data);

server = http.createServer((req, res) => {
    pathName = req.url;
    const {query , pathname} = url.parse(req.url, true);

    // Overview Page
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200,{'Content-Type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml); 
        res.end(output);
    } 
    // Product Page
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-Type': 'text/html'})
        const product = dataObj[query.id] 
        const output = replaceTemplate(tempProduct,product)
        res.end(output);
    }
    // API
    else if (pathname === '/api') {
        res.writeHead(200,{'Content-type':'application/json'})
        res.end(data)
            
    }
    // Not Found 
    else {
        res.writeHead(404,{
            'ContentType' : 'text/html'
        })
        res.end('<h1>Page Not Found 404 Error</h1>');
    }
})

server.listen(3000, '127.0.0.1', () => {
    console.log('listening on port 3000')
})