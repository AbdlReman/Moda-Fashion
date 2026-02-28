"use client"
import { useState } from "react";
import Button from "../Buttons";
import { FaAnglesRight } from "react-icons/fa6";
import SectionHeading from "../SectionHeading";
import Spacing from "../Spacing";
import Link from "next/link";
import Image from "next/image";

const MedicalTabSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState("brain_althim");

  return (
    <>
      <div className="container">
        <SectionHeading
          SectionSubtitle={data.subtitle}
          SectionTitle={data.title}
          variant={"text-center"}
        />

        <div className="cs_height_50 cs_height_lg_50" />
        <div className="cs_tabs">
          <ul className="cs_tab_links cs_style_1 cs_bold">
            {data.tabsTitle.map((tab, index) => (
              <li
                key={index}
                className={activeTab === tab.href ? "active" : ""}
              >
                <Link
                  href={`#${tab.href}`}
                  onClick={() => setActiveTab(tab.href)}
                >
                  <span className="cs_tab_link_icon cs_center">
                  <Image src={tab.iconUrl} alt="img" width={27} height={31}   />
                  </span>
                  <span>{tab.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="cs_height_50 cs_height_lg_50" />
          <div className="tab-content">
            {data.tabsData.map((tab, index) => (
              <div
                key={index}
                id={tab.id}
                className={`cs_tab ${activeTab === tab.id ? "active" : ""}`}
              >
                {activeTab === tab.id && (
                  <div className="cs_card cs_style_2">
                    <div className="row cs_gap_y_30 align-items-xl-center">
                      <div className="col-lg-6">
                        <div className="cs_card_thumb cs_radius_5">
                        <Image src={tab.imageSrc} alt="img" width={630} height={445}   />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="cs_card_text">
                          <h2 className="cs_card_title">{tab.title}</h2>
                          <p className="cs_card_subtitle">{tab.subtitle}</p>
                          <ul className="cs_list cs_style_1 cs_mp0">
                            {tab.points.map((point, idx) => (
                              <li key={idx}>
                                <i>
                                <Image src={point.icon} alt="img" width={20} height={17}   />
                                </i>
                                {point.text}
                              </li>
                            ))}
                          </ul>
                          

                          <Button
                            btnText={tab.buttonText}
                            variant={"cs_btn cs_style_1 cs_color_1"}
                            btnIcons={<FaAnglesRight />}
                            btnUrl={tab.linkHref}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Spacing lg={80} md={120} />

      <hr />
    </>
  );
};

export default MedicalTabSection;
