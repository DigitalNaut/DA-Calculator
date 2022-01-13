const nameExp = /^(.+), (.+)$/;
const nameQualifierExp = /^.+,.+$/;

export function fixName(text: string) {
  // if (text.length) return 'O'.repeat(text.length);

  if (!nameQualifierExp.test(text)) return text;

  const matches = nameExp.exec(text);
  if (matches && matches.length > 1) return `${matches[2]} ${matches[1]}`;
  return text;
}

export function fixCountryName(name?: string) {
  return fixName(name || '');
}

export function fixInput(input: string) {
  return input.trim();
}

export default { fixName, fixCountryName, fixInput };
