const fs = require('fs');
const selfsigned = require('selfsigned');

// Generate self-signed certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];
const options = { days: 365 };

selfsigned.generate(attrs, options, function(err, pems) {
  if (err) {
    console.error("Error generating certificate:", err);
    return;
  }

  fs.writeFileSync('server.key', pems.private);
  fs.writeFileSync('server.cert', pems.cert);
  console.log('✅ server.key and server.cert generated in current folder');
});
