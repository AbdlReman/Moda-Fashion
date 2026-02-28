"use client"
import { FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';

const BlogsLeft = ({ data }) => {
  return (
    <>
      <div className="col-lg-8">
        <div className="cs_post_details cs_style_1">
          <div className="cs_post_category_badge">
            <span className="cs_post_category">
              <FaTag /> {data.category}
            </span>
          </div>
          <h1 className="cs_post_title_large">{data.title}</h1>
          <p className="cs_post_subtitle_large">{data.subtitle}</p>
          
          <ul className="cs_post_meta cs_mp0">
            <li>
              <i>
                <FaUser />
              </i>
              {data.author}
            </li>
            <li>
              <i>
                <FaCalendarAlt />
              </i>
              {data.date}
            </li>
          </ul>
          
          <div className="cs_height_30 cs_height_lg_20" />
          
          {data.content.map((paragraph, index) => (
            <p key={index} className="cs_post_content_paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogsLeft;
