import { describe, it, expect } from 'vitest';
import {
  bold,
  bracketize,
  linkify,
  snakecaseToCapitalized,
} from '@/service/formatter';

describe('snakecaseToCapitalized', () => {
  it.concurrent('should transform snake_case to capitalize', () => {
    const input = 'foo_bar';
    const output = snakecaseToCapitalized(input);

    expect(output).toBe('Foo Bar');
  });

  it.concurrent('should not perform any changes', () => {
    const input = 'Foo Bar';
    const output = snakecaseToCapitalized(input);

    expect(output).toBe(input);
  });
});

describe('bold', () => {
  it('should format text to bold markdown text', () => {
    const input = 'foo';
    const output = bold(input);

    expect(output).toBe('*foo*');
  });
});

describe('bracketize', () => {
  it('should enclose text with square brackets', () => {
    const input = 'foo';
    const output = bracketize(input);

    expect(output).toBe('[foo]');
  });
});

describe('bracketize', () => {
  it('should generate markdown link', () => {
    const text = 'https://www.google.com';
    const alias = 'Google link';
    const output = linkify(text, alias);

    expect(output).toBe('<https://www.google.com|Google link>');
  });
});
