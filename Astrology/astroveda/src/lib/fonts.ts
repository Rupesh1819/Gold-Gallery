import { EB_Garamond, Manrope, Noto_Serif_Devanagari, Noto_Sans_Devanagari } from 'next/font/google';

export const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-eb-garamond',
});

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

export const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-serif-deva',
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-deva',
});

export const fontVariables = [
  ebGaramond.variable,
  manrope.variable,
  notoSerifDevanagari.variable,
  notoSansDevanagari.variable,
].join(' ');
