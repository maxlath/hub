module.exports = {
  identity: value => value,

  isNumber: num => typeof num === 'number' && !Number.isNaN(num),

  isNonEmptyString: str => typeof str === 'string' && str.length > 0,

  // encodeURIComponent ignores !, ', (, ), and *
  // cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
  fixedEncodeURIComponent: str => {
    return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter)
  }
}

const encodeCharacter = char => '%' + char.charCodeAt(0).toString(16)
