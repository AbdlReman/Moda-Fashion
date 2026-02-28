"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

const PageHeading = ({ data }) => {
  const [urlSegments, setUrlSegments] = useState([]);
  useEffect(() => {
    const pathSegments = window.location.pathname
      .split("/")
      .filter((segment) => segment !== "");
    setUrlSegments(pathSegments);
  }, []);
  return (
    <div className="container">
      <h1 className="cs_page_title">{data?.title}</h1>
      <ol className="breadcrumb text-capitalize">
        <li className="breadcrumb-item">
          <Link href="/">Home</Link>
        </li>
        {urlSegments.map((segment, index) => (
          <li key={index} className="breadcrumb-item">
            {index < urlSegments.length - 1 ? (
              <Link href={`/${urlSegments.slice(0, index + 1).join("/")}`}>
                {segment}
              </Link>
            ) : (
              <span className="active">{segment}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PageHeading;
