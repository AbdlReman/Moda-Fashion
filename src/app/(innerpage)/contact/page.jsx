import ContactSection from '@/app/Components/ContactSection';
import LocationMap from '@/app/Components/LocationMap/Index';
import PageHeading from '@/app/Components/PageHeading';
import Section from '@/app/Components/Section';
import React from 'react';


const headingData = {
    backgroundImage: '/assets/img/contact-img.png',
    title: 'Contact Us',
  };
  
  const contactData = {
    sectionSubtitle: 'GET IN TOUCH',
    SectionTitle: 'We Love to Hear From You',
    teethShapeImg: '/assets/img/shape.jpg',
    contactImg: '/assets/img/shape.png',
    iconBox: {
      style: 'cs_style_4',
      icon: '/assets/img/shape.jpg',
      title: '24/7 Support',
      subtitle: 'We are here to help you anytime',
    },
  };
  
  const mapData = {
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.5851960224!2d-0.2664050245106056!3d51.52852620113951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2z4Kay4Kao4KeN4Kah4KaoLCDgpq_gp4HgppXgp43gpqTgprDgpr7gppzgp43gpq8!5e0!3m2!1sbn!2sbd!4v1723284219451!5m2!1sbn!2sbd',
  };

const page = () => {
    return (
        <div>
      <Section
        className={'cs_page_heading cs_bg_filed cs_center'}
        backgroundImage="/assets/img/contact-img.png"
      >
        <PageHeading data={headingData} />
      </Section>

      <Section
        topSpaceLg="70"
        topSpaceMd="110"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
      >
        <ContactSection reverseOrder={true} data={contactData} />
      </Section>

      <Section bottomSpaceLg="0" bottomSpaceMd="0">
        <LocationMap mapSrc={mapData.mapSrc} />
      </Section>


        </div>
    );
};

export default page;