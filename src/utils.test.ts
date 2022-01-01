import { describe, expect, it } from 'vitest';
import { getCurrentDate } from '@/utils';

describe('getCurrentDate', () => {
  const days = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
  ];

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  it('should output localized date', () => {
    const pattern = /(\w+), (\d+) (\w+) (\d+)/;
    const output = getCurrentDate();

    expect(output).toMatch(pattern);

    const matches = output.match(pattern) as string[];

    expect(days).toContain(matches[1]);
    expect(Number.parseInt(matches[2], 10)).not.toBeNaN();
    expect(months).toContain(matches[3]);
    expect(Number.parseInt(matches[4], 10)).not.toBeNaN();
  });
});
