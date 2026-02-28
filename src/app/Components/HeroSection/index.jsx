"use client"
import { useEffect, useRef, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import Slider from "react-slick";
import Button from "../Buttons";
import Image from "next/image";
const HeroSection = ({ data }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    fade: false,
    swipeToSlide: true,
  };

  const settings2 = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    fade: false,
    swipeToSlide: true,
    vertical: true,
    arrows: false,
  };

  return (
    <>
      <section className="position-relative">
        <div className="cs_hero_slider_thumb slick-slider">
          <Slider
            {...settings}
            asNavFor={nav2}
            ref={(slider) => (sliderRef1 = slider)}
          >
            {data?.primarySlider.map((items, index) => (
              <div className="cs_hero_slider_thumb_item" key={index}>
                <div
                  className="cs_hero cs_style_1 cs_center cs_bg_filed"
                  style={{
                    backgroundImage: `url(${items.bgImageUrl})`,
                    position: 'relative',
                  }}
                >
                  {/* Dark gradient overlay for better text visibility - hidden for first slider */}
                  {index !== 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to right, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="cs_hero_text" style={{ background: 'transparent' }}>
                      <div className="cs_hero_text_in">
                        <h1
                          className="cs_hero_title"
                          style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                          dangerouslySetInnerHTML={{ __html: items.title }}
                        />
                        <p
                          className="cs_hero_subtitle"
                          style={{ color: 'rgba(255,255,255,0.95)', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                          dangerouslySetInnerHTML={{
                            __html: items.contactSubtitle,
                          }}
                        />
                        <div className="cs_hero_info" style={{ borderColor: '#ff4da6' }}>
                          <h3
                            style={{ color: '#ff4da6' }}
                            dangerouslySetInnerHTML={{
                              __html: items.contactTitle,
                            }}
                          />
                          <p
                            style={{ color: 'rgba(255,255,255,0.9)' }}
                            dangerouslySetInnerHTML={{ __html: items.contact }}
                          />
                        </div>
                        <div className="cs_hero_btns">
                          <Button
                            btnText={items.btnText1}
                            variant={"cs_btn cs_style_1 cs_color_1"}
                            btnIcons={<FaAnglesRight />}
                            btnUrl={items.link}
                          />
                          <Button
                            btnText={items.btnText2}
                            variant={"cs_btn cs_style_1 cs_color_2"}
                            btnIcons={<FaAnglesRight />}
                            btnUrl={items.link2}
                          />
                        </div>
                      </div>
                      <div className="cs_hero_shape">
                      <Image src={items.iconImgUrl} className="cs_spinner_img" alt="img" width={142} height={190}   />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="cs_hero_slider_nav slick-slider">
          <Slider
            asNavFor={nav1}
            ref={(slider) => (sliderRef2 = slider)}
            slidesToShow={3}
            swipeToSlide={true}
            focusOnSelect={true}
            {...settings2}
          >
            {data?.secondarySlider?.map((items, index) => (
              <div className="cs_hero_slider_thumb_mini" key={index}>
                <Image src={items}  alt="img" width={90} height={92}   />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
