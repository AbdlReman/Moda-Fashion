'use client';
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";
import Slider from "react-slick";
import SectionHeading from "../SectionHeading";
import Spacing from "../Spacing";
import Link from "next/link";
import Image from "next/image";

const TeamSection = ({ data, bgColor, variant, hr }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    swipeToSlide: true,
    appendDots: (dots) => (
      <div>
        <ul>{dots}</ul>
      </div>
    ),
    dotsClass: `${variant}`,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="about-team">
      <div className="container">
        <SectionHeading
          SectionSubtitle={data.subtitle}
          SectionTitle={data.title}
          variant={"text-center"}
        />

        <div className="cs_height_50 cs_height_lg_50" />
        <div className="cs_slider cs_style_1 cs_slider_gap_24">
          <div className="cs_slider_container">
            <div className="cs_slider_wrapper">
              <Slider {...settings}>
                {data?.sliderData.map((item, index) => (
                  <div className="cs_slide" key={index}>
                    <div
                      className={`cs_team cs_style_1 ${
                        bgColor ? "cs_accent_bg" : "cs_blue_bg"
                      } `}
                    >
                      <div
                        className={`cs_team_shape ${
                          bgColor ? "cs_blue_bg" : "cs_accent_bg "
                        }`}
                      />
                      <Link href={item.link} className="cs_team_thumbnail">
                      <Image src={item.imageUrl} alt="img" width={306} height={429}   />
                      </Link>
                      <div className="cs_team_bio">
                        <h3 className="cs_team_title cs_extra_bold mb-0">
                          <Link href={item.link}>{item.name}</Link>
                        </h3>
                        <p className="cs_team_subtitle">{item.profession}</p>
                        <div className="cs_social_btns cs_style_1">
                          <Link href={item.facebook} className="cs_center">
                            <i>
                              <FaFacebookF />
                            </i>
                          </Link>
                          <Link href={item.pinterest} className="cs_center">
                            <i>
                              <FaPinterestP />
                            </i>
                          </Link>
                          <Link href={item.twitter} className="cs_center">
                            <i>
                              <FaTwitter />
                            </i>
                          </Link>
                          <Link href={item.instagram} className="cs_center">
                            <i>
                              <FaInstagram />
                            </i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
      {bgColor && (
        <div className="cs_team_bg_dark cs_blue_bg">
          <div className="cs_team_bg_white cs_white_bg" />
        </div>
      )}
      <Spacing lg={80} md={120} />

      {hr && <hr />}
    </div>
  );
};

export default TeamSection;
