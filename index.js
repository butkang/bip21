// https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki
// bitcoin:<address>[?amount=<amount>][?label=<label>][?message=<message>]

var qs = require('qs')

function decode (uri, urnScheme) {
  urnScheme = urnScheme || 'butk'
  if (uri.indexOf(urnScheme) !== 0 ||
    uri.charAt(urnScheme.length) !== ':'
  ) throw new Error('Invalid BIP21 URI: ' + uri)

  var split = uri.indexOf('?')
  var address = uri.slice(urnScheme.length + 1, split === -1 ? undefined : split)
  var query = split === -1 ? '' : uri.slice(split + 1)
  var options = qs.parse(query)

  if (options.amount) {
    options.amount = Number(options.amount)
    if (!isFinite(options.amount)) throw new Error('Invalid amount')
    if (options.amount < 0) throw new Error('Invalid amount')
  }

  return { address: address, options: options }
}

function encode (address, options, urnScheme) {
  options = options || {}
  var scheme = urnScheme || 'butk'
  var query = qs.stringify(options)

  if (options.amount) {
    if (!isFinite(options.amount)) throw new TypeError('Invalid amount')
    if (options.amount < 0) throw new TypeError('Invalid amount')
  }

  return scheme + ':' + address + (query ? '?' : '') + query
}

module.exports = {
  decode: decode,
  encode: encode
}
