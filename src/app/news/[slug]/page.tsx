import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/ScrollToTop';
import HeaderScrollEffect from '@/components/HeaderScrollEffect';
import { BACKEND_DOMAIN } from '@/api/config';
import styles from './page.module.css';

interface NewsArticle {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string; // Giữ backward compatibility
  mainImage?: string; // Hình ảnh chính
  additionalImages?: Array<{
    url: string;
    alt: string;
    order: number;
  }>; // Các hình ảnh phụ
  slug: string;
  publishDate: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  views?: number;
  tags?: string[];
  author?: string;
}

async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const res = await fetch(`${BACKEND_DOMAIN}/api/home/news/${slug}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) return data.data;
    return null;
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const newsArticle = await getNewsBySlug(params.slug);

  if (!newsArticle) {
    notFound();
  }

  // Format date phía server
  const publishDate = new Date(newsArticle.publishDate);
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <HeaderScrollEffect />
      <Header />
      <main className={styles.newsDetailPage}>
        <div className="container py-5">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/news">News</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {newsArticle.title}
              </li>
            </ol>
          </nav>
          {/* Article Header */}
          <div className={styles.newsHeader + " mb-4"}>
            <h1 className={styles.newsTitle + " mb-3"}>{newsArticle.title}</h1>
            <div className={styles.newsMeta + " d-flex align-items-center mb-3"}>
              <span className={styles.newsDate + " me-3"}>
                <i className="far fa-calendar-alt me-1"></i> {formattedDate}
              </span>
              <span className={styles.newsAuthor}>
                <i className="far fa-user me-1"></i> {newsArticle.author}
              </span>
            </div>
            {/* Tags */}
            {newsArticle.tags && Array.isArray(newsArticle.tags) && newsArticle.tags.length > 0 && (
              <div className={styles.newsTags + " mb-4"}>
                {newsArticle.tags.map((tag: string, index: number) => (
                  <span 
                    key={`${tag}-${index}`} 
                    className="news-tag"
                    style={{ 
                      background: '#e6f3ff', 
                      padding: '5px 14px', 
                      borderRadius: '18px',
                      fontSize: '0.85rem',
                      color: '#0d6efd',
                      marginRight: '10px',
                      marginBottom: '10px',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Unified Image Slider: main image + additional images */}
          <div className={styles.additionalImagesGallery + " mb-5"}>
            <div className={styles.imageSlider}>
              <div className={styles.sliderContainer}>
                {/* Main image as first slide */}
                <div className={styles.slideItem}>
                  <Image
                    src={(newsArticle.mainImage || newsArticle.image).startsWith('/images') 
                      ? (newsArticle.mainImage || newsArticle.image) 
                      : `${BACKEND_DOMAIN}${newsArticle.mainImage || newsArticle.image}`}
                    alt={newsArticle.title}
                    width={1200}
                    height={630}
                    className="img-fluid rounded"
                    style={{ objectFit: 'cover', width: '100%', height: '400px' }}
                  />
                </div>
                {/* Additional images follow */}
                {(newsArticle.additionalImages || [])
                  .sort((a, b) => a.order - b.order)
                  .map((img, index) => (
                    <div key={index} className={styles.slideItem}>
                      <Image
                        src={img.url.startsWith('/images') ? img.url : `${BACKEND_DOMAIN}${img.url}`}
                        alt={img.alt || `${newsArticle.title} - Image ${index + 1}`}
                        width={800}
                        height={600}
                        className="img-fluid rounded"
                        style={{ objectFit: 'cover', width: '100%', height: '400px' }}
                      />
                    </div>
                  ))}
              </div>
              <div className={styles.sliderControls}>
                <button 
                  className={styles.prevBtn}
                  onClick={() => {
                    const slider = document.querySelector(`.${styles.sliderContainer}`) as HTMLElement;
                    if (slider) {
                      slider.scrollBy({ left: -400, behavior: 'smooth' });
                    }
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className={styles.nextBtn}
                  onClick={() => {
                    const slider = document.querySelector(`.${styles.sliderContainer}`) as HTMLElement;
                    if (slider) {
                      slider.scrollBy({ left: 400, behavior: 'smooth' });
                    }
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              <div className={styles.sliderDots}>
                {[0, ...(newsArticle.additionalImages || []).map((_, i) => i + 1)].map((idx) => (
                  <button
                    key={idx}
                    className={styles.dot}
                    onClick={() => {
                      const slider = document.querySelector(`.${styles.sliderContainer}`) as HTMLElement;
                      if (slider) {
                        slider.scrollTo({ left: idx * 400, behavior: 'smooth' });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Article Content */}
          <div className={styles.newsContent + " mb-5"}>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: newsArticle.content }}
            />
          </div>
          {/* Back to News */}
          <div className="d-flex justify-content-center mt-5">
            <Link href="/news" className="btn btn-primary">
              <i className="fas fa-arrow-left me-2"></i> Back to News
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
} 