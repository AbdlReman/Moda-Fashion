import { Rubik, Poppins } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './sass/style.scss';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--body-font',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--heading-font',
});

export const metadata = {
  title: {
    absolute: '',
    default: 'Matrimonial - Wedding Planning & Marriage Services',
    template: '%s | Matrimonial - Wedding Planning & Marriage Services',
  },
  description: 'Professional wedding planning and matrimonial services. We help you create the perfect wedding day with our expert team of planners, photographers, and vendors.',
  openGraph: {
    title: 'Matrimonial - Wedding Planning & Marriage Services',
    description: 'Professional wedding planning and matrimonial services. We help you create the perfect wedding day with our expert team of planners, photographers, and vendors.',
    image: '/assets/img/couple.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="Themeservices" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${rubik.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
