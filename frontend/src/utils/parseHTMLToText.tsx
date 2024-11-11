export function parseHTMLToText(value: string) {
  // remove html code and return only test
  return value.replace(/<[^>]*>?/gm, '').slice(0, 20) + '...';
}
