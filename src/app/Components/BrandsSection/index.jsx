"use client"
import Slider from "react-slick";
import Spacing from "../Spacing";
import Image from "next/image";

const BrandsSlider = ({ data = [], hr }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    swipeToSlide: true,
    arrows: false,
  };

  return (
    <>
      <div className="container">
        <div className="cs_slider cs_style_1 cs_slider_gap_24" data-aos="fade">
          <div className="cs_slider_wrapper">
            <Slider {...settings}>
              {data.map((brand, index) => (
                <div key={index} className="cs_slide">
                  <div className="cs_brand cs_style_1 text-center">
                  <Image src={brand.image} alt="img" width={122} height={23}   />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <Spacing lg={90} md={100} />
      {hr && <hr />}
    </>
  );
};

export default BrandsSlider;
