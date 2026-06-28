import type { ImportedCode } from '../types';

export function enc(o: unknown): string {
  try {
    return 'QM26.' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  } catch {
    return '';
  }
}

export function dec(code: string): ImportedCode | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(code.replace('QM26.', '').trim()))));
  } catch {
    return null;
  }
}
