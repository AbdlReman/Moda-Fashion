import React from 'react';
import HeroSection from '../Components/HeroSection';
import Section from '../Components/Section';
import CtaSection from '../Components/CtaSection';
import About from '../Components/About';
import CounterSection from '../Components/FunSection/CounterSection';
import Service from '../Components/Service';
import TeamSection from '../Components/TeamSection';
import BrandsSlider from '../Components/BrandsSection';
import ChooseUs from '../Components/ChooseUs';
import ProjectSection from '../Components/ProjectSection';
import CtaSection1 from '../Components/CtaSection/CtaSection1';
import MedicalTabSection from '../Components/MedicalTabSection';
import ContactSection2 from '../Components/ContactSection/ContactSection2';
import BlogSection from '../Components/BlogsSection';

const heroData = {
    primarySlider: [
      {
        bgImageUrl: '/assets/img/bannerr.png',
        title: ' Over 1000 people have found their perfect match with us',
        contactSubtitle:
          '',
        contactTitle: '',
        contact: 'Meet Some one new today',
        btnText1: 'Register Free',
        link: '/register',
        btnText2: 'Read Blog',
        link2: '/blog',
        iconImgUrl: '/assets/img/logo.png',
      },
      {
        bgImageUrl: '/assets/img/slider1.jpg',
        title: 'Complete <br>Wedding <span>Solutions.</span>',
        contactSubtitle:
          'Comprehensive wedding services to make your special day unforgettable. We also offer matrimonial matchmaking services to connect verified brides and grooms from respected families.',
        contactTitle: 'Plan Your Perfect Wedding.',
        contact: 'Call Us at: (+1) 555 123 4567',
        btnText1: 'Create Profile',
        link: '/register',
        btnText2: 'Read Blog',
        link2: '/blog',
        iconImgUrl: '/assets/img/logo.png',
      },
      {
        bgImageUrl: '/assets/img/blog-post1.jpg',
        title: ' <span>100% Verified Profiles Only.</span>',
        contactSubtitle:
          'Every profile is manually verified to ensure authenticity. Find genuine brides and grooms ready for a lifetime commitment.',
        contactTitle: 'Safe & Secure Matchmaking.',
        contact: 'Call Us at: (+1) 555 123 4567',
        btnText1: 'Join Now',
        link: '/register',
        btnText2: 'Read Blog',
        link2: '/blog',
        iconImgUrl: '/assets/img/logo.png',
      },
    ],
    secondarySlider: [
      '/assets/img/bannerr.png',
      '/assets/img/slider1.jpg',
      '/assets/img/blog-post1.jpg',
    ],
  };
  
const ctaData = {
    imageUrl: '/assets/img/cta.jpg',
    title: 'Plan Your Perfect Wedding Today.',
    subtitle: 'Comprehensive wedding services to make your special day unforgettable. We also offer matrimonial matchmaking for finding your perfect life partner.',
    buttonUrl: '/register',
    buttonText: 'Get Started',
  };
  
  const aboutData = {
    sectionSubtitle: 'ABOUT US',
    sectionTitle: 'Your Trusted Wedding Services Provider.',
    aboutText:
      'We provide comprehensive wedding services to make your special day unforgettable. From planning to execution, we handle every detail. We also offer matrimonial matchmaking services.',
    service:
      "Our wedding services include venue selection, catering, photography, decoration, and more. <a href='/about'>READ MORE +</a>",
    experienceYears: '10+',
    experienceTitle: 'Years of Trust',
    videoUrl: 'https://www.youtube.com',
    videoText: 'How It Works',
    iconboxes: [
      {
        imgUrl: '/assets/img/logo.png',
        title: 'Verified Profiles',
        subtitle: 'Every profile is manually verified.',
      },
      {
        imgUrl: '/assets/img/logo2.png',
        title: 'Privacy Protected',
        subtitle: 'Your personal information is secure.',
      },
    ],
  
    btnUrl: '/blog',
    btnText: 'Read Our Blog',
    sectionImgUrl: '/assets/img/about-img1.png',
    headImgUrl: '/assets/img/about-thumb4.jpg',
  };
  
  const countersData = [
    {
      iconUrl: '/assets/img/logo.png',
      number: '50K+',
      title: 'Verified Profiles',
    },
    {
      iconUrl: '/assets/img/logo2.png',
      number: '15K+',
      title: 'Successful Matches',
    },
    {
      iconUrl: '/assets/img/logo.png',
      number: '10K+',
      title: 'Happy Couples',
    },
    {
      iconUrl: '/assets/img/logo2.png',
      number: '100+',
      title: 'Cities Covered',
    },
  ];
  
  const serviceData = {
    subtitle: 'OUR SERVICES',
    title: 'Wedding Services',
    description:
      'Delbari offers comprehensive wedding services to make your special day perfect.<br> From wedding planning to venue selection, catering, and photography, we provide end-to-end solutions.<br> We also offer matrimonial matchmaking services to help you find your perfect life partner with verified profiles.',
    services: [
      {
        backgroundImage: '/assets/img/hotel-view1.jpg',
        iconUrl: '/assets/img/logo.png',
        index: '01',
        title: 'Find Groom',
        subtitle: 'Browse thousands of verified groom profiles',
        link: '/blog',
      },
      {
        backgroundImage: '/assets/img/hotel-view2.jpg',
        iconUrl: '/assets/img/logo2.png',
        index: '02',
        title: 'Find Bride',
        subtitle: 'Discover verified bride profiles from respected families',
        link: '/blog',
      },
      {
        backgroundImage: '/assets/img/hotel-view3.jpg',
        iconUrl: '/assets/img/logo.png',
        index: '03',
        title: 'Profile Verification',
        subtitle: '100% verified profiles for genuine matchmaking',
        link: '/blog',
      },
      {
        backgroundImage: '/assets/img/hotel-view4.jpg',
        iconUrl: '/assets/img/logo2.png',
        index: '04',
        title: 'Smart Matching',
        subtitle: 'AI-powered compatibility matching system',
        link: '/blog',
      },
      {
        backgroundImage: '/assets/img/event-background.jpg',
        iconUrl: '/assets/img/logo.png',
        index: '05',
        title: 'Privacy Control',
        subtitle: 'Complete control over your profile visibility',
        link: '/blog',
      },
      {
        backgroundImage: '/assets/img/event-bg.jpg',
        iconUrl: '/assets/img/logo2.png',
        index: '06',
        title: 'Secure Chat',
        subtitle: 'Safe and private communication with matches',
        link: '/blog',
      },
      {
        backgroundImage: '/assets/img/reservation-background.jpg',
        iconUrl: '/assets/img/logo.png',
        index: '07',
        title: 'Family Involvement',
        subtitle: 'Involve family members in the matchmaking process',
        link: '/blog',
      },
      {
        backgroundImage: '/assets/img/stories-bg.jpg',
        iconUrl: '/assets/img/logo2.png',
        index: '08',
        title: 'Relationship Support',
        subtitle: 'Guidance and support throughout your journey',
        link: '/blog',
      },
    ],
    footerIcon: '/assets/img/logo.png',
    footerText:
      'Making your wedding dreams come true.<br>Complete wedding services and matrimonial matchmaking with Delbari',
    footerLink: '/blog',
    footerLinkText: 'VIEW ALL',
  };
  
  const teamData = {
    subtitle: 'SUCCESS STORIES',
    title: 'Couples Who Found <br />Love Through Delbari',
    sliderData: [
      {
        name: 'Ahmed & Fatima',
        profession: 'Married in 2024',
        imageUrl: '/assets/img/1.jpg',
        link: '/blog',
        facebook: '/',
        pinterest: '/',
        twitter: '/',
        instagram: '/',
      },
      {
        name: 'Hassan & Aisha',
        profession: 'Married in 2024',
        imageUrl: '/assets/img/2.jpg',
        link: '/blog',
        facebook: '/',
        pinterest: '/',
        twitter: '/',
        instagram: '/',
      },
      {
        name: 'Omar & Zainab',
        profession: 'Married in 2023',
        imageUrl: '/assets/img/3.jpg',
        link: '/blog',
        facebook: '/',
        pinterest: '/',
        twitter: '/',
        instagram: '/',
      },
      {
        name: 'Yusuf & Mariam',
        profession: 'Married in 2023',
        imageUrl: '/assets/img/4.jpg',
        link: '/blog',
        facebook: '/',
        pinterest: '/',
        twitter: '/',
        instagram: '/',
      },
      {
        name: 'Ibrahim & Sara',
        profession: 'Married in 2024',
        imageUrl: '/assets/img/5.jpg',
        link: '/blog',
        facebook: '/',
        pinterest: '/',
        twitter: '/',
        instagram: '/',
      },
    ],
  };
  
  const brandData = [
    { image: '/assets/img/envato-logo.png', altText: 'Brand 1' },
    { image: '/assets/img/envato-logo.png', altText: 'Brand 2' },
    { image: '/assets/img/envato-logo.png', altText: 'Brand 3' },
    { image: '/assets/img/envato-logo.png', altText: 'Brand 4' },
    { image: '/assets/img/envato-logo.png', altText: 'Brand 5' },
    { image: '/assets/img/envato-logo.png', altText: 'Brand 6' },
  ];
  
  const sectionData = {
    subtitle: 'WHY CHOOSE DELBARI',
    title: 'Complete Wedding Services <br /> & Matrimonial Matchmaking.',
    services: [
      {
        iconUrl: '/assets/img/logo.png',
        title: '100% Verified Profiles',
        subtitle: 'Every profile is manually verified for authenticity',
      },
      {
        iconUrl: '/assets/img/logo2.png',
        title: '24/7 Support',
        subtitle: 'Dedicated support team available round the clock',
      },
      {
        iconUrl: '/assets/img/logo.png',
        title: 'Privacy Protected',
        subtitle: 'Advanced privacy controls to protect your information',
      },
      {
        iconUrl: '/assets/img/logo2.png',
        title: 'Smart Matching',
        subtitle: 'AI-powered matching based on compatibility',
      },
      {
        iconUrl: '/assets/img/logo.png',
        title: 'Genuine Profiles',
        subtitle: 'Real brides and grooms from respected families',
      },
      {
        iconUrl: '/assets/img/logo2.png',
        title: 'Free Registration',
        subtitle: 'Create your profile and start searching for free',
      },
    ],
  };
  
  const projectData = {
    title: 'Find Your Match By<br> Profession & Location',
    subtitle: 'BROWSE PROFILES',
    description:
      'Search through thousands of verified profiles. Find compatible brides and grooms based on profession, education, location, and family values.',
    tabs: [
      { id: 'doctors', label: 'Doctors' },
      { id: 'engineers', label: 'Engineers' },
      { id: 'business', label: 'Business' },
      { id: 'teachers', label: 'Teachers' },
    ],
    tabData: [
      {
        id: 'doctors',
        items: [
          {
            imgUrl: '/assets/img/gift1.jpg',
            title: 'Medical Professionals',
            subtitle:
              'Verified profiles of doctors, surgeons, and healthcare professionals.',
            index: 1,
          },
          {
            imgUrl: '/assets/img/gift2.jpg',
            title: 'Dentists & Specialists',
            subtitle:
              'Find matches among dental and medical specialists.',
            index: 2,
          },
          {
            imgUrl: '/assets/img/gift3.jpg',
            title: 'Nurses & Healthcare',
            subtitle:
              'Browse profiles of nurses and healthcare workers.',
            index: 3,
          },
        ],
      },
      {
        id: 'engineers',
        items: [
          {
            imgUrl: '/assets/img/wedding-thumb.jpg',
            title: 'Software Engineers',
            subtitle:
              'Tech professionals from top IT companies worldwide.',
            index: 1,
          },
          {
            imgUrl: '/assets/img/wedding-thumb2.jpg',
            title: 'Civil Engineers',
            subtitle:
              'Construction and infrastructure professionals.',
            index: 2,
          },
          {
            imgUrl: '/assets/img/event-loc.jpg',
            title: 'Mechanical Engineers',
            subtitle:
              'Manufacturing and mechanical industry professionals.',
            index: 3,
          },
        ],
      },
      {
        id: 'business',
        items: [
          {
            imgUrl: '/assets/img/hotel-view1.jpg',
            title: 'Business Owners',
            subtitle:
              'Entrepreneurs and successful business owners.',
            index: 1,
          },
          {
            imgUrl: '/assets/img/hotel-view2.jpg',
            title: 'Corporate Professionals',
            subtitle:
              'Managers and executives from reputed companies.',
            index: 2,
          },
          {
            imgUrl: '/assets/img/hotel-view3.jpg',
            title: 'Finance Experts',
            subtitle:
              'Banking, accounting, and finance professionals.',
            index: 3,
          },
        ],
      },
      {
        id: 'teachers',
        items: [
          {
            imgUrl: '/assets/img/1.jpg',
            title: 'University Professors',
            subtitle:
              'Academics and researchers from universities.',
            index: 1,
          },
          {
            imgUrl: '/assets/img/2.jpg',
            title: 'School Teachers',
            subtitle:
              'Dedicated educators from schools and colleges.',
            index: 2,
          },
          {
            imgUrl: '/assets/img/3.jpg',
            title: 'Education Administrators',
            subtitle:
              'Principals and education management professionals.',
            index: 3,
          },
        ],
      },
    ],
  };
  
  const ctaData1 = {
    videoLink: 'https://www.youtube.com/',
    videoButtonText: 'WATCH VIDEO',
    subtitle: 'HOW IT WORKS',
    title: 'Find Your Perfect Match in 3 Simple Steps.',
    description:
      'Create your profile, browse verified matches, and connect with your potential life partner. Join thousands of happy couples who found love through Delbari.',
    buttonLink: '/register',
    buttonText: 'Register Free',
    brandImage: '/assets/img/logo.png',
  };
  
  const medicalTabsData = {
    subtitle: 'Matchmaking Services',
    title: 'How We Help You Find<br> Your Perfect Match',
    tabsTitle: [
      {
        href: 'search',
        iconUrl: '/assets/img/logo.png',
        label: 'Search Profiles',
      },
      {
        href: 'verification',
        iconUrl: '/assets/img/logo2.png',
        label: 'Verification',
      },
      {
        href: 'matching',
        iconUrl: '/assets/img/logo.png',
        label: 'Smart Matching',
      },
      {
        href: 'connect',
        iconUrl: '/assets/img/logo2.png',
        label: 'Connect & Meet',
      },
    ],
    tabsData: [
      {
        id: 'search',
        imageSrc: '/assets/img/event-img1.png',
        title: 'Search From Thousands of Verified Profiles',
        subtitle:
          'Browse through our extensive database of verified brides and grooms. Filter by profession, education, location, and family values to find your perfect match.',
        points: [
          {
            icon: '/assets/img/logo.png',
            text: 'Advanced search filters for precise matching.',
          },
          {
            icon: '/assets/img/logo.png',
            text: 'Browse profiles by profession, location, and education.',
          },
        ],
        linkHref: '/contact',
        buttonText: 'Start Searching',
      },
      {
        id: 'verification',
        imageSrc: '/assets/img/event-img2.png',
        title: '100% Verified & Genuine Profiles',
        subtitle:
          'Every profile on Delbari is manually verified. We ensure authenticity through ID verification, phone verification, and background checks.',
        points: [
          {
            icon: '/assets/img/logo.png',
            text: 'Multi-step verification process for all profiles.',
          },
          {
            icon: '/assets/img/logo.png',
            text: 'Government ID and phone number verification.',
          },
        ],
        linkHref: '/contact',
        buttonText: 'Learn More',
      },
      {
        id: 'matching',
        imageSrc: '/assets/img/event-img3.png',
        title: 'AI-Powered Compatibility Matching',
        subtitle:
          'Our advanced algorithm analyzes your preferences, values, and lifestyle to suggest the most compatible matches for a blessed union.',
        points: [
          {
            icon: '/assets/img/logo.png',
            text: 'Smart recommendations based on compatibility scores.',
          },
          {
            icon: '/assets/img/logo.png',
            text: 'Daily curated matches tailored to your preferences.',
          },
        ],
        linkHref: '/contact',
        buttonText: 'View Matches',
      },
      {
        id: 'connect',
        imageSrc: '/assets/img/event-img4.png',
        title: 'Connect Safely & Meet Your Match',
        subtitle:
          'Once you find a compatible match, connect through our secure messaging system. Involve your family in the process and arrange meetings with confidence.',
        points: [
          {
            icon: '/assets/img/logo.png',
            text: 'Secure and private messaging with matches.',
          },
          {
            icon: '/assets/img/logo.png',
            text: 'Family involvement features for traditional matchmaking.',
          },
        ],
        linkHref: '/contact',
        buttonText: 'Get Started',
      },
    ],
  };
  
  const blogsData = {
    sectionTitle: 'MATRIMONIAL BLOG',
    sectionSubtitle: 'Tips &amp; Guidance for Finding Your Life Partner',
    postsData: [
      {
        title: 'How to Create an Attractive Matrimonial Profile',
        subtitle:
          'Learn the secrets to creating a profile that stands out and attracts compatible matches.',
        date: 'Dec 15',
        category: 'Profile Tips',
        author: 'Relationship Expert',
        thumbnail: '/assets/img/blog-post1.jpg',
        btnText: 'Read More',
        postLink: '/blog',
        authorIcon: '/assets/img/logo.png',
        commentIcon: '/assets/img/logo2.png',
      },
      {
        title: 'Questions to Ask Before Getting Married',
        subtitle:
          'Important conversations every couple should have before their Nikah ceremony.',
        date: 'Dec 10',
        category: 'Relationship',
        author: 'Family Counselor',
        thumbnail: '/assets/img/blog-post2.jpg',
        btnText: 'Read More',
        postLink: '/blog',
        authorIcon: '/assets/img/logo.png',
        commentIcon: '/assets/img/logo2.png',
      },
      {
        title: 'Involving Family in Your Matchmaking Journey',
        subtitle:
          'How to balance family involvement with your personal preferences when finding a life partner.',
        date: 'Dec 05',
        category: 'Family',
        author: 'Marriage Advisor',
        thumbnail: '/assets/img/cta.jpg',
        btnText: 'Read More',
        postLink: '/blog',
        authorIcon: '/assets/img/logo.png',
        commentIcon: '/assets/img/logo2.png',
      },
    ],
  };

const page = () => {
    return (
        <div>
        {/* Start Hero Section */}
        <HeroSection data={heroData} />
        {/* End Hero Section */}

      {/* Start CTA Section */}
      <Section
        className={
          'cs_cta cs_style_1 cs_blue_bg position-relative overflow-hidden'
        }
      >
        <CtaSection data={ctaData} />
      </Section>

      {/* End CTA Section */}

      {/* Start About Section */}
      <Section
        topSpaceLg="80"
        topSpaceMd="120"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
        className="cs_about cs_style_1 position-relative"
      >
        <About data={aboutData} />
      </Section>
      {/* End About Section */}

      {/* Start Counter */}
      <Section className="cs_counter_area cs_gray_bg">
        <CounterSection data={countersData} />
      </Section>
      {/* End Counter */}

      {/* Start Service Section */}
      <Section
        topSpaceLg="70"
        topSpaceMd="110"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
        className={'cs_gray_bg'}
      >
        <Service cardBg={'cs_gray_bg'} data={serviceData} />
      </Section>
      {/* End Service Section */}

      {/* Start Secondary CTA Section */}
      <Section
        topSpaceLg="60"
        topSpaceMd="80"
        bottomSpaceLg="60"
        bottomSpaceMd="80"
        className="cs_cta cs_style_1 cs_blue_bg position-relative overflow-hidden"
      >
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="cs_section_title cs_fs_50 mb-3 cs_white_color">
                Find Your Match & Register
              </h2>
              <p className="cs_section_subtitle mb-4 cs_white_color" style={{ opacity: 0.9, fontSize: '18px' }}>
                Looking for your perfect life partner? Our matrimonial matchmaking service connects you with verified profiles from respected families.
              </p>
              <div className="d-flex justify-content-center flex-wrap gap-3">
                <a href="/blog" className="cs_btn cs_style_1 cs_btn_lg cs_color_3">
                  <span>Read Our Blog</span>
                </a>
                <a href="/register" className="cs_btn cs_style_1 cs_btn_lg cs_color_1">
                  <span>Register Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="cs_cta_shape" />
      </Section>
      {/* End Secondary CTA Section */}

      {/* Start Team Section */}
    
      {/* End Brand Section */}

      {/* Start Why Choose Us Section */}
      <Section
        topSpaceLg="70"
        topSpaceMd="110"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
        className="cs_gray_bg cs_bg_filed"
       
      >
        <ChooseUs data={sectionData} />
      </Section>
      {/* End Why Choose Us Section */}

      {/* Start Projects Section */}
      <Section topSpaceLg="70" topSpaceMd="110" className="cs_tabs">
        <ProjectSection data={projectData} />
      </Section>
      {/* End Projects Section */}

      {/* Start CTA Section */}
      <Section
        topSpaceLg="70"
        topSpaceMd="110"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
        className="cs_cta cs_style_2 cs_blue_bg cs_bg_filed cs_center"
        backgroundImage="/assets/img/cta2.jpg"
      >
        <CtaSection1 data={ctaData1} />
      </Section>
      {/* End CTA Section */}

      {/* Start Medical Tab Section */}
      <Section topSpaceLg="70" topSpaceMd="110">
        <MedicalTabSection data={medicalTabsData} />
      </Section>
      {/* End Medical Tab Section */}

      {/* Start Contact Solution */}
      <ContactSection2></ContactSection2>
      {/* End Contact Solution */}

      {/* Start Blog Section */}
      <Section
        topSpaceLg="70"
        topSpaceMd="110"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
      >
        <BlogSection data={blogsData} />
      </Section>
      {/* End Blog Solution */}

        </div>
    );
};

export default page;