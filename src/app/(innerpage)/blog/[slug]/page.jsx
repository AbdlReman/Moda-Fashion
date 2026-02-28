'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageHeading from '@/app/Components/PageHeading';
import Section from '@/app/Components/Section';
import { FaCalendarAlt, FaUser, FaTag, FaArrowRightLong } from 'react-icons/fa6';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchRecentPosts();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/by-slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      }
    } catch (e) {
      console.error('Error fetching blog:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const res = await fetch('/api/blog?published=true&limit=5');
      if (res.ok) {
        const data = await res.json();
        setRecentPosts(data.items || []);
      }
    } catch (e) {
      console.error('Error fetching recent posts:', e);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-5">
        <h3>Blog post not found</h3>
        <Link href="/blog" className="btn btn-primary mt-3">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Section
        className={'cs_page_heading cs_bg_filed cs_center'}
        backgroundImage={blog.featuredImage || '/assets/img/page_heading_bg.jpg'}
      >
        <PageHeading data={{ title: 'Blog Details' }} />
      </Section>

      <Section
        topSpaceLg="80"
        topSpaceMd="120"
        bottomSpaceLg="80"
        bottomSpaceMd="120"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="cs_post_details cs_style_1">
                <div className="cs_post_category_badge">
                  <span className="cs_post_category">
                    <FaTag /> {blog.category}
                  </span>
                </div>
                <h1 className="cs_post_title_large">{blog.title}</h1>
                {blog.excerpt && (
                  <p className="cs_post_subtitle_large">{blog.excerpt}</p>
                )}

                <ul className="cs_post_meta cs_mp0">
                  <li>
                    <i><FaUser /></i>
                    {blog.author}
                  </li>
                  <li>
                    <i><FaCalendarAlt /></i>
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </li>
                </ul>

                <div className="cs_height_30 cs_height_lg_20" />

                {blog.featuredImage && (
                  <div className="mb-4">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      width={800}
                      height={450}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </div>
                )}

                <div
                  className="cs_post_content_paragraph"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <strong>Tags: </strong>
                    {blog.tags.map((tag, i) => (
                      <span key={i} className="badge bg-primary me-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="col-lg-4">
              <div className="cs_height_0 cs_height_lg_50" />
              <div className="cs_sidebar cs_style_1">
                <div className="cs_sidebar_widget cs_radius_15">
                  <h3 className="cs_sidebar_title">Recent Posts</h3>
                  {recentPosts
                    .filter((p) => p.slug !== slug)
                    .slice(0, 4)
                    .map((post) => (
                      <div key={post._id} className="cs_post cs_style_2">
                        <div className="cs_post_info">
                          <div className="cs_post_meta">
                            <i><FaCalendarAlt /></i>{' '}
                            {formatDate(post.publishedAt || post.createdAt)}
                          </div>
                          <h3 className="cs_post_title mb-0">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                        </div>
                      </div>
                    ))}
                </div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="cs_sidebar_widget cs_radius_15">
                    <div className="cs_sidebar_tags">
                      <h3 className="cs_sidebar_title">Tags</h3>
                      <div className="cs_tag_list">
                        {blog.tags.map((tag, i) => (
                          <span key={i} className="cs_tag_link">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default BlogDetailPage;
