import PageHeading from '@/app/Components/PageHeading';
import ProjectsSection1 from '@/app/Components/ProjectSection/ProjectsSection1';
import Section from '@/app/Components/Section';
import React from 'react';

const headingData = {
    title: 'Our Portfolio',
  };
  
  const projectsSectionData = {
    sectionTitle: 'All The Great Work That Medical Service',
    sectionSubtitle: 'OUR PORTFOLIO',
    sectionDescription:
      'We are privileged to work with hundreds of future-thinking medical, including many of the world’s top hardware, software, and brands, feel safe and comfortable in establishing.',
    projects: [
      {
        id: 1,
        title: 'Medical Board',
        subtitle: 'Medical / Doctor',
        imageSrc: '/assets/img/project_4.jpg',
        link: '/',
      },
      {
        id: 2,
        title: 'Gynecology Project',
        subtitle: 'Medical / Doctor',
        imageSrc: '/assets/img/project_5.jpg',
        link: '/',
      },
      {
        id: 3,
        title: 'Dental Project',
        subtitle: 'Medical / Doctor',
        imageSrc: '/assets/img/project_6.jpg',
        link: '/',
      },
      {
        id: 4,
        title: 'Neurology Project',
        subtitle: 'Medical / Doctor',
        imageSrc: '/assets/img/project_7.jpg',
        link: '/',
      },
      {
        id: 5,
        title: 'Eye Care Project',
        subtitle: 'Medical / Doctor',
        imageSrc: '/assets/img/project_8.jpg',
        link: '/',
      },
      {
        id: 6,
        title: 'Surgery Project',
        subtitle: 'Medical / Doctor',
        imageSrc: '/assets/img/project_9.jpg',
        link: '/',
      },
    ],
  };
  

const page = () => {
    return (
        <div>
       <Section
        className={'cs_page_heading cs_bg_filed cs_center'}
        backgroundImage="/assets/img/page_heading_bg.jpg"
      >
        <PageHeading data={headingData} />
      </Section>           

      <Section
        topSpaceLg="70"
        topSpaceMd="110"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
      >
        <ProjectsSection1 data={projectsSectionData} />
      </Section>

        </div>
    );
};

export default page;