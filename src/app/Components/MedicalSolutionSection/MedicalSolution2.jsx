import Link from "next/link";
import SectionHeading from "../SectionHeading";
import { FaAngleRight } from "react-icons/fa6";
import Image from "next/image";

const MedicalSolution2 = ({ data }) => {
  return (
    <>
      <div className="container">
        <div className="row cs_gap_y_40">
          <div className="col-lg-6">
            <div className="cs_solution_content_wrapper">
              <SectionHeading
                SectionTitle={data.title}
                SectionSubtitle={data.subtitle}
                SectionDescription={data.description}
                variant={"s_style_1"}
              />

              <ul className="cs_solution_links cs_style_1 cs_mp0">
                {data.links.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>
                      <span className="cs_tab_link_icon_left cs_center">
                      <Image src={link.iconSrc} alt="img" width={22} height={22}   />
                      </span>
                      <span>{link.text}</span>
                      <span className="cs_tab_link_icon_right cs_center">
                        <i>
                          <FaAngleRight />
                        </i>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="cs_solution_thumbnail">
            <Image src={data.thumbnailSrc} alt="img" width={686} height={649}   />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalSolution2;
