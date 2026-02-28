import Link from "next/link";
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaArrowRightLong, FaMagnifyingGlass } from "react-icons/fa6";

const BlogsRight = ({ data }) => {
  return (
    <>
      <aside className="col-lg-4">
        <div className="cs_height_0 cs_height_lg_50" />
        <div className="cs_sidebar cs_style_1">
          {/* Search */}
          <div className="cs_sidebar_widget cs_radius_15 cs_search">
            <input type="text" placeholder={data.searchPlaceholder} />
            <span className="cs_search_icon cs_blue_bg cs_white_color">
              <i>
                <FaMagnifyingGlass />
              </i>
            </span>
          </div>

          {/* Recent Posts */}
          <div className="cs_sidebar_widget cs_radius_15">
            <h3 className="cs_sidebar_title">Recent Posts</h3>
            {data.recentPosts.map((post, index) => (
              <div key={index} className="cs_post cs_style_2">
                <div className="cs_post_info">
                  <div className="cs_post_meta">
                    <i>
                      <FaCalendarAlt />
                    </i>{" "}
                    {post.date}
                  </div>
                  <h3 className="cs_post_title mb-0">
                    <Link href={post.link}>{post.title}</Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="cs_sidebar_widget cs_radius_15">
            <h3 className="cs_sidebar_title">{data.secTitle}</h3>
            <ul className="cs_categories cs_mp0">
              {data.categories.map((category, index) => (
                <li key={index}>
                  <Link href={category.link}>
                    <i>
                      <FaArrowRightLong />
                    </i>{" "}
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="cs_sidebar_widget cs_radius_15">
            <div className="cs_sidebar_tags">
              <h3 className="cs_sidebar_title">{data.secTitle2}</h3>
              <div className="cs_tag_list">
                {data.tags.map((tag, index) => (
                  <Link key={index} href={tag.tagUrl} className="cs_tag_link">
                    {tag.tagTitle}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default BlogsRight;
