export default function (headers) {
  return (headers['accept-language'] || '')
  .split(',')[0]
  .trim()
  .split('-')[0]
  .trim()
  .toLowerCase()
}
