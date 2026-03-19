const https = require('https');

https.get('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDTxdMo4PBCNGB7UDhU5O8PpG2TO53XuT8', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log(JSON.stringify(parsed.models.map(m => m.name)));
        } catch (e) { console.error(e); }
    });
}).on('error', (err) => {
    console.log("Error: " + err.message);
});
