import Image from 'next/image';
import Link from 'next/link';
import { FaPhoneAlt, FaFacebookF, FaInstagram } from 'react-icons/fa';
import {
  FaLocationDot,
  FaRegClock,
} from 'react-icons/fa6';

const Footer = () => {
  const data = {
    backgroundImage: '/assets/img/footer_bg.jpg',
    logo: '/assets/img/logo.png',
    contactText:
      'Matrimonial Services Hours: <br /> Mon - Sat: 9.00 am. - 7.00 pm.',
    contactText2: '123 Matrimonial Avenue, Match City, MC 12345',
    contactText3: '+1 (555) 123-4567',
    facebookHref: 'https://www.facebook.com/profile.php?id=61579424798123&rdid=MndWMYpU1h5kpuNd&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1FDMpoRG4X%2F#',
    instagramHref: 'https://www.instagram.com/delbari_australia',
    widgets: [
      {
        title: 'Our Services',
        links: [
          { href: '/blog', text: 'Blog' },
          { href: '/contact', text: 'Contact Us' },
          { href: '/login', text: 'Member Login' },
          { href: '/register', text: 'Join Now' },
        ],
      },
      {
        title: 'Quick Links',
        links: [
          { href: '/', text: 'Home' },
          { href: '/blog', text: 'Blog' },
          { href: '/contact', text: 'Contact' },
          { href: '/login', text: 'Log In' },
        ],
      },
      {
        title: 'Information',
        links: [
          { href: '/how-it-works', text: 'How It Works' },
          { href: '/our-mission', text: 'Our Mission' },
          { href: '/terms-and-conditions', text: 'Terms and Conditions' },
          { href: '/privacy-policy', text: 'Privacy Policy' },
        ],
      },
    ],
    recentPosts: [
      {
        href: '/blog',
        image: '/assets/img/blog-post1.jpg',
        date: '15 dec 2024',
        title: '10 Essential Matrimonial Matchmaking Tips',
      },
      {
        href: '/blog',
        image: '/assets/img/blog-post2.jpg',
        date: '10 dec 2024',
        title: 'Finding Your Perfect Life Partner',
      },
    ],
    copyrightText: 'Copyright © 2024 Matrimonial, All Rights Reserved.',
    footerMenu: [
      { href: '/how-it-works', text: 'How It Works' },
      { href: '/our-mission', text: 'Our Mission' },
      { href: '/terms-and-conditions', text: 'Terms & Conditions' },
      { href: '/privacy-policy', text: 'Privacy Policy' },
    ],
  };

  return (
    <footer
      className="cs_footer cs_blue_bg cs_bg_filed cs_white_color"
      style={{ backgroundImage: `url(${data.backgroundImage})` }}
    >
      <div className="container">
        <div className="cs_footer_row">
          <div className="cs_footer_col">
            <div className="cs_footer_highlight_col cs_accent_bg">
              <div className="cs_footer_logo">
              <Image src={data.logo} alt="img" width={205} height={53}   />
              </div>
              <ul className="cs_footer_contact cs_mp_0">
                <li>
                  <i
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <FaRegClock />
                  </i>
                  <span
                    dangerouslySetInnerHTML={{ __html: data.contactText }}
                  />
                </li>
                <li>
                  <i
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <FaLocationDot />
                  </i>
                  <span
                    dangerouslySetInnerHTML={{ __html: data.contactText2 }}
                  />
                </li>
                {/* <li>
                  <i
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <FaPhoneAlt />
                  </i>
                  <span
                    dangerouslySetInnerHTML={{ __html: data.contactText3 }}
                  />
                </li> */}
              </ul>
              <div className="cs_social_btns cs_style_1">
                <Link href={data.facebookHref} className="cs_center" target="_blank" rel="noopener noreferrer">
                  <i>
                    <FaFacebookF />
                  </i>
                </Link>
                <Link href={data.instagramHref} className="cs_center" target="_blank" rel="noopener noreferrer">
                  <i>
                    <FaInstagram />
                  </i>
                </Link>
              </div>
            </div>
          </div>

          {data.widgets.map((widget, index) => (
            <div className="cs_footer_col" key={index}>
              <div className="cs_footer_widget">
                <h2 className="cs_footer_widget_title">{widget.title}</h2>
                <ul className="cs_footer_widget_nav_list cs_mp_0">
                  {widget.links.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="cs_footer_col">
            <div className="cs_footer_widget">
              <h2 className="cs_footer_widget_title">Recent Posts</h2>
              <ul className="cs_recent_post_list cs_mp_0">
                {data.recentPosts.map((post, index) => (
                  <li key={index}>
                    <div className="cs_recent_post">
                      <Link href={post.href} className="cs_recent_post_thumb">
                      <Image src={post.image} alt="img" width={85} height={85}   />
                      </Link>
                      <div className="cs_recent_post_right">
                        <p>{post.date}</p>
                        <h3 className="cs_recent_post_title">
                          <Link href={post.href}>{post.title}</Link>
                        </h3>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="cs_footer_bottom cs_primary_bg">
        <div className="container">
          <div className="cs_footer_bottom_in">
            <p className="cs_footer_copyright mb-0">{data.copyrightText}</p>
            <ul className="cs_footer_menu cs_mp_0">
              {data.footerMenu.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
