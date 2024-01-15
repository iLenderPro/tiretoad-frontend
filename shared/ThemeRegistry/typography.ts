import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});
export const typography = {
  fontFamily: roboto.style.fontFamily,
  fontSize: 14,
  color: '#000000',
  body1: {
    fontSize: '1rem',
  },
  h4: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  h6: {
    fontSize: '1rem',
    lineHeight: '1.2rem',
    fontWeight: 700,
    textAlign: 'left' as const,
  },
};
