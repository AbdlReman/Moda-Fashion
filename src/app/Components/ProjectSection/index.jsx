"use client"
import { useState } from "react";
import Spacing from "../Spacing";
import Link from "next/link";
import Image from "next/image";

const ProjectSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState("dental");

  return (
    <>
      <div className="container">
        <div className="cs_section_heading cs_style_1 cs_type_1">
          <div className="cs_section_heading_left">
            <p
              className="cs_section_subtitle cs_accent_color"
              data-aos="fade-left"
            >
              <span className="cs_shape_left" />
              {data.subtitle}
            </p>
            <h2
              className="cs_section_title"
              dangerouslySetInnerHTML={{ __html: data.title }}
            ></h2>
          </div>
          <div className="cs_section_heading_right">
            <p className="mb-0">{data.description}</p>
            {/* <ul className="cs_tab_links cs_style_3 cs_mp_0">
              {data.tabs.map((tab) => (
                <li
                  key={tab.id}
                  className={tab.id === activeTab ? "active" : ""}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Link href={`#${tab.id}`}>{tab.label}</Link>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
        <div className="cs_height_50 cs_height_lg_50" />
      </div>
      <div className="cs_tab_body">
        {data?.tabData.map((tab) => (
          <div
            key={tab.id}
            className={`container-fluide cs_tab ${
              tab.id === activeTab ? "active" : ""
            }`}
            id={tab.id}
          >
            <div className="row cs_gap_y_30">
              {tab?.items.map((item, index) => (
                <div key={index} className="col-lg-4">
                  <div className="cs_card cs_style_1">
                    <Link href="/" className="cs_card_thumbnail d-block">
                    <Image src={item.imgUrl}  className="w-100" alt="img" width={598} height={479}   />
                    </Link>
                    <div className="cs_card_info_wrapper">
                      <div className="cs_card_text">
                        <h3 className="cs_card_title">
                          <Link href="/">{item.title}</Link>
                        </h3>
                        <p className="cs_card_subtitle mb-0">{item.subtitle}</p>
                      </div>
                      <div className="cs_card_index cs_center rounded-circle">
                        {item.index}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Spacing lg={50} md={90} />
      <hr />
    </>
  );
};

export default ProjectSection;
