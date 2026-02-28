"use client"
import { FaAnglesRight, FaRegCircleCheck } from "react-icons/fa6";
import VideoModal from "../VideoSection/Modal";
import { useState } from "react";
import SectionHeading from "../SectionHeading";
import Button from "../Buttons";
import Link from "next/link";
import Image from "next/image";

const AboutSection1 = ({ data }) => {
  const [toggle, setToggle] = useState(false);

  const [iframeSrc, setIframeSrc] = useState("about:blank");

  const handelClick = () => {
    setIframeSrc(`${data.videoLink}`);
    setToggle(!toggle);
  };
  const handelClose = () => {
    setIframeSrc("about:blank");
    setToggle(!toggle);
  };
  return (
    <>
      <div className="container">
        <div className="row cs_gap_y_40">
          <div className="col-lg-6">
            <div className="cs_about_thumb">
            <Image src="/assets/img/about_img_3.png" alt="img" width={680} height={751}   />
              <div
                className="cs_experience_box cs_center "
                data-aos="fade-down"
              >
                <p className="cs_experience_box_number">
                  {data.experienceYears}
                </p>
                <p className="cs_experience_box_title">
                  {data.experienceTitle}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="cs_about_content">
              <SectionHeading
                SectionSubtitle={data.sectionSubtitle}
                SectionTitle={data.sectionTitle}
              />

              <p className="cs_about_text">{data.aboutText}</p>
              <div className="cs_iconbox_1_wrap">
                <div className="cs_iconbox cs_style_1">
                  <div className="cs_iconbox_head">
                    <div className="cs_iconbox_icon cs_center">
                    <Image src={data.iconUrl} alt="img" width={26} height={26}   />
                    </div>
                    <h3 className="cs_iconbox_title m-0">{data.title}</h3>
                  </div>
                  <div className="cs_iconbox_img">
                  <Image src={data.imgUrl} alt="img" width={200} height={81}   />
                  </div>
                </div>
                <div className="cs_iconbox cs_style_1">
                  <div className="cs_iconbox_img">
                  <Image src={data.imgUrl2} alt="img" width={200} height={81}   />
                  </div>
                  <div className="cs_iconbox_head">
                    <div className="cs_iconbox_icon cs_center">
                    <Image src={data.iconUrl2} alt="img" width={25} height={29}   />
                    </div>
                    <h3 className="cs_iconbox_title m-0">{data.title2}</h3>
                  </div>
                </div>
              </div>

              <div className="cs_about_iconbox">
                <div className="cs_about_iconbox_icon cs_center">
                  <i>
                    <FaRegCircleCheck />
                  </i>
                </div>
                <p className="cs_about_iconbox_subtitle">
                  {data.aboutIconboxSubtitle}{" "}
                  <Link href={data.readMoreLink}>{data.readMoreText}</Link>
                </p>
              </div>
              <div className="cs_about_btns">
                <a className="cs_video_open" onClick={handelClick}>
                  <span className="cs_player_btn cs_center">
                    <span />
                  </span>
                  <span className="cs_play_btn_text">{data.videoText}</span>
                </a>
                <Button
                  btnIcons={<FaAnglesRight />}
                  btnText={data.aboutMoreText}
                  variant={"cs_btn cs_style_1 cs_color_1"}
                  btnUrl={data.aboutMoreLink}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cs_section_img">
      <Image src={data.sectionImageUrl} alt="img" width={228} height={248}   />
      </div>

      <VideoModal
        isTrue={toggle}
        iframeSrc={iframeSrc}
        handelClose={handelClose}
      />
    </>
  );
};

export default AboutSection1;
