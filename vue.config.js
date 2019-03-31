const fs = require('fs')

module.exports = {
  assetsDir: 'assets',
  devServer: {
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem')
    }
  }
}
