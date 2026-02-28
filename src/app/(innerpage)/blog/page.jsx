'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeading from '@/app/Components/PageHeading';
import Section from '@/app/Components/Section';
import SectionHeading from '@/app/Components/SectionHeading';
import { FaAngleRight } from 'react-icons/fa';

const headingData = {
  title: 'Blog',
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog?published=true&page=${page}&limit=9`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Error fetching blogs:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <Section
        className="cs_page_heading cs_bg_filed cs_center"
        backgroundImage="/assets/img/gallery-img1.jpg"
      >
        <PageHeading data={headingData} />
      </Section>

      <Section
        topSpaceLg="70"
        topSpaceMd="110"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
      >
        <div className="container">
          <SectionHeading
            SectionSubtitle="OUR BLOG"
            SectionTitle="Latest Articles &amp; Inspiration"
            variant="text-center"
          />
          <div className="cs_height_50 cs_height_lg_50" />

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5">
              <h5>No blog posts available yet</h5>
              <p>Check back soon for new content!</p>
            </div>
          ) : (
            <>
              <div className="cs_posts_grid cs_style_1">
                {blogs.map((blog) => (
                  <article key={blog._id} className="cs_post cs_style_1">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="cs_post_thumbnail position-relative"
                    >
                      {blog.featuredImage ? (
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          width={392}
                          height={277}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 392,
                            height: 277,
                            background: '#e9ecef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ color: '#6c757d' }}>No Image</span>
                        </div>
                      )}
                      <div className="cs_post_category position-absolute">
                        {blog.category}
                      </div>
                    </Link>
                    <div className="cs_post_content position-relative">
                      <div className="cs_post_meta_wrapper">
                        <div className="cs_posted_by cs_center position-absolute">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </div>
                        <div className="cs_post_meta_item">
                          <span>By: {blog.author}</span>
                        </div>
                      </div>
                      <h3 className="cs_post_title">
                        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>
                      {blog.excerpt && (
                        <p className="cs_post_subtitle">{blog.excerpt}</p>
                      )}
                      <Link href={`/blog/${blog.slug}`} className="cs_post_btn">
                        <span>Read More</span>
                        <span>
                          <i>
                            <FaAngleRight />
                          </i>
                        </span>
                      </Link>
                      <div className="cs_post_shape position-absolute" />
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <>
                  <div className="cs_height_50 cs_height_lg_50" />
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-primary"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                    <span className="btn btn-light disabled">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline-primary"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Section>
    </div>
  );
};

export default BlogPage;
