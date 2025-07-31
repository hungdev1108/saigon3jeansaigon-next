"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import newsService from '@/services/newsService';
import { BACKEND_DOMAIN } from '@/api/config';

// Define interface for NewsArticle
interface NewsArticle {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  slug: string;
  publishDate: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  views?: number;
  tags?: string[];
  author?: string;
}

export default function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch featured news
  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        const news = await newsService.getFeaturedNews(3);
        setFeaturedNews(Array.isArray(news) ? news : []);
      } catch (error) {
        console.error("Error fetching featured news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedNews();
  }, []);
  
  if (isLoading) {
    return (
      <section className="featured-news-section">
        <div className="container">
          <h2 className="section-title text-center">LATEST NEWS</h2>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (featuredNews.length === 0) {
    return null;
  }
  
  return (
    <section className="featured-news-section">
      <div className="container">
        <h2 className="section-title text-center">LATEST NEWS</h2>
        
        <div className="row">
          {featuredNews.map((article) => {
            // Format date
            const publishDate = new Date(article.publishDate);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).format(publishDate);
            
            return (
              <div key={article.id || article._id} className="col-md-4 mb-4">
                <div className="card news-card h-100">
                  {/* Featured Tag */}
                  {article.isFeatured && (
                    <div className="featured-tag">
                      <span>Featured</span>
                    </div>
                  )}
                  
                  {/* Card Image - Make entire image clickable */}
                  <Link href={`/news/${article.slug}`} className="card-img-link">
                    <div className="card-img-top position-relative">
                      <Image
                        src={article.image.startsWith('/images') ? article.image : `${BACKEND_DOMAIN}${article.image}`}
                        alt={article.title}
                        width={400}
                        height={250}
                        className="img-fluid"
                        style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                      />
                      <div className="news-date-badge">
                        {formattedDate}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">
                    <h3 className="card-title">
                      <Link href={`/news/${article.slug}`} className="text-decoration-none">
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="card-text flex-grow-1">
                      {article.excerpt}
                    </p>
                    
                    {/* Read More Link */}
                    <Link 
                      href={`/news/${article.slug}`} 
                      className="btn btn-outline-primary mt-auto"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-4">
          <Link href="/news" className="btn btn-primary">
            View All News
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .featured-news-section {
          padding: 60px 0;
          background-color: #f8f9fa;
        }
        
        .section-title {
          margin-bottom: 30px;
          position: relative;
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          padding-bottom: 15px;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background-color: #0d6efd;
        }
        
        .news-card {
          transition: transform 0.3s, box-shadow 0.3s;
          overflow: hidden;
          border: none;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .news-card .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        
        .news-card .card-title a {
          color: #333;
          transition: color 0.2s;
        }
        
        .news-card .card-title a:hover {
          color: #0d6efd;
        }
        
        .card-img-link {
          display: block;
          overflow: hidden;
          cursor: pointer;
        }
        
        .card-img-link:hover img {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
        
        .news-date-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px 10px;
          font-size: 0.8rem;
        }
        
        .featured-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1;
          background-color: #ffc107;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .news-card .card-title {
            font-size: 1.1rem;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
} 