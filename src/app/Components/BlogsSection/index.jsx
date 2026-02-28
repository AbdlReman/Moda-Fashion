"use client"
import { useState, useEffect } from "react";
import Slider from "react-slick";
import Button from "../Buttons";
import { FaAngleRight } from "react-icons/fa6";
import SectionHeading from "../SectionHeading";
import Link from "next/link";
import Image from "next/image";

const BlogSection = ({ data }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/blog?published=true&limit=6')
      .then((r) => r.json())
      .then((json) => {
        const items = (json.items || []).map((b) => ({
          title: b.title,
          subtitle: b.excerpt || '',
          date: b.publishedAt
            ? new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '',
          category: b.category || 'General',
          author: b.author || 'Admin',
          thumbnail: b.featuredImage || '/assets/img/blog-post1.jpg',
          btnText: 'Read More',
          postLink: `/blog/${b.slug}`,
        }));
        setPosts(items);
      })
      .catch(() => {});
  }, []);

  const displayPosts = posts.length > 0 ? posts : (data?.postsData || []);

  const settings = {
    dots: true,
    infinite: displayPosts.length > 3,
    speed: 1000,
    slidesToShow: Math.min(3, displayPosts.length),
    fade: false,
    swipeToSlide: true,
    appendDots: (dots) => (
      <div>
        <ul>{dots}</ul>
      </div>
    ),
    dotsClass: "cs_pagination cs_style_2",
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: Math.min(2, displayPosts.length),
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

  if (displayPosts.length === 0) return null;

  return (
    <div className="container">
      <SectionHeading
        SectionSubtitle={data?.sectionTitle || 'OUR BLOG'}
        SectionTitle={data?.sectionSubtitle || 'Latest Articles &amp; Inspiration'}
        variant="text-center"
      />

      <div className="cs_height_50 cs_height_lg_50" />
      <div className="cs_slider cs_style_1 cs_slider_gap_24">
        <div className="cs_slider_container">
          <div className="cs_slider_wrapper">
            <Slider {...settings}>
              {displayPosts.map((post, index) => (
                <div key={index} className="cs_slide">
                  <article className="cs_post cs_style_1">
                    <Link
                      href={post.postLink}
                      className="cs_post_thumbnail position-relative"
                    >
                      <Image src={post.thumbnail} alt="img" width={396} height={280} />
                      <div className="cs_post_category position-absolute">
                        {post.category}
                      </div>
                    </Link>
                    <div className="cs_post_content position-relative">
                      <div className="cs_post_meta_wrapper">
                        <div className="cs_posted_by cs_center position-absolute">
                          {post.date}
                        </div>
                        <div className="cs_post_meta_item">
                          <span>By: {post.author}</span>
                        </div>
                      </div>
                      <h3 className="cs_post_title">
                        <Link href={post.postLink}>{post.title}</Link>
                      </h3>
                      <p className="cs_post_subtitle">{post.subtitle}</p>

                      <Button
                        variant="cs_post_btn"
                        btnIcons={<FaAngleRight />}
                        btnUrl={post.postLink}
                        btnText={post.btnText}
                      />

                      <div className="cs_post_shape position-absolute" />
                    </div>
                  </article>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
