import { Open_Sans } from 'next/font/google';

const roboto = Open_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});
export const typography = {
  fontFamily: roboto.style.fontFamily,
  fontSize: 16,
  color: '#0E0D0D',
  allVariants: {
    color: '#0E0D0D',
    fontSize: 16,
  },
  body1: {
    fontSize: '1rem',
  },
  body2: {
    fontSize: '0.875rem',
  },
  h1: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  h3: {
    fontSize: '1.85rem',
    fontWeight: 500,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  h6: {
    fontSize: '1rem',
    lineHeight: '1.2rem',
    fontWeight: 700,
    textAlign: 'left' as const,
  },
};
