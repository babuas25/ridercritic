declare module 'draftjs-to-html' {
  const draftToHtml: (rawContentState: Record<string, unknown>) => string;
  export default draftToHtml;
}