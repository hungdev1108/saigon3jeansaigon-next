import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="video-container">
          <Image
            src="/images/home_banner-section2.jpg"
            alt="Factory Aerial View"
            className="img-fluid w-100"
            width={1920}
            height={1080}
          />
          <div className="overlay"></div>
        </div>
        <div className="text-overlay">
          <h1>
            WELCOME TO
            <br />
            SAIGON 3 JEAN
          </h1>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <div className="arrow-down"></div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="info-cards py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-img-top video-container">
                  <video className="w-100" muted loop controls autoPlay>
                    <source src="/videos/SAIGON_3_JEAN.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="card-body blue-bg text-white">
                  <h5 className="card-title">
                    FASHION-DRIVEN MANUFACTURING IN VIETNAM
                  </h5>
                  <p className="card-text">
                    Our state-of-the-art facilities provide high-quality garment
                    production with advanced technologies.
                  </p>
                  <a
                    href="#"
                    className="btn btn-outline-light"
                    id="watchVideoBtn"
                  >
                    WATCH VIDEO
                    <span style={{ marginLeft: 8 }}>
                      <i className="fas fa-play-circle"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-img-top">
                  <Image
                    src="/images/home_banner-section2.jpg"
                    alt="Sustainable Production"
                    className="img-fluid w-100"
                    width={1920}
                    height={1080}
                  />
                </div>
                <div className="card-body green-bg text-white">
                  <h5 className="card-title">SUSTAINABLE PRODUCTION</h5>
                  <p className="card-text">
                    Committed to eco-friendly practices and sustainable
                    manufacturing processes.
                  </p>
                  <a href="#" className="btn btn-outline-light">
                    LEARN MORE
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-img-top">
                  <Image
                    src="/images/home_banner-section2.jpg"
                    alt="Energy Infrastructure"
                    className="img-fluid w-100"
                    width={1920}
                    height={1080}
                  />
                </div>
                <div className="card-body brown-bg text-white">
                  <h5 className="card-title">ENERGY INFRASTRUCTURE</h5>
                  <p className="card-text">
                    Optimized energy solutions for efficient and sustainable
                    manufacturing operations.
                  </p>
                  <a href="#" className="btn btn-outline-light">
                    LEARN MORE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Popup */}
      <div className="video-modal" id="videoModal">
        <div className="video-modal-content">
          <div className="video-modal-body">
            <button className="video-modal-close" id="closeVideoModal">
              <i className="fas fa-times"></i>
            </button>
            <video id="videoPlayer" controls>
              <source src="/videos/SAIGON_3_JEAN.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* AI Integration Section */}
      <section className="ai-integration">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12 position-relative">
              <Image
                src="/images/home_banner-section2.jpg"
                alt="Conference Room"
                className="img-fluid w-100"
                width={1920}
                height={1080}
              />
              <div className="overlay"></div>
              <div className="ai-content text-center text-white">
                <h2 className="fw-bold">
                  AI INTEGRATION FOR
                  <br />
                  AUTOMATED PRODUCTION
                </h2>
                <a href="#" className="btn btn-outline-light px-4 mt-3">
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider Line Section */}
      <section className="divider-section pb-4">
        <div className="container">
          <hr
            className="divider"
            style={{
              borderTop: "2px solid rgba(0, 0, 0, 0.3)",
              margin: "2rem auto",
            }}
          />
        </div>
      </section>

      {/* Factory View Section */}
      <section className="factory-view mb-4">
        <div className="container-fluid p-0">
          <Image
            src="/images/home_banner-section3.png"
            alt="Factory Aerial View"
            className="img-fluid w-100"
            width={1920}
            height={1080}
          />
        </div>
      </section>

      {/* Our Customers Section */}
      <section className="customers py-5">
        <div className="container-fluid">
          <div className="customers-wrapper position-relative">
            {/* Background Image */}
            <div className="customers-background">
              <Image
                src="/images/branding_our_customer/back_ground.png"
                alt="World Map"
                className="world-map-bg"
                width={1920}
                height={1080}
              />
            </div>

            {/* Content Overlay */}
            <div className="customers-content">
              <div className="container">
                <h2 className="section-title text-center mb-5">OUR CUSTOMER</h2>

                {/* DENIM & WOVEN Section */}
                <div className="customer-category mb-2">
                  <h4 className="text-center mb-4">DENIM & WOVEN</h4>
                  <div className="row customer-logos-row justify-content-center align-items-center">
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/uniqlo.png"
                          alt="Uniqlo"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/muji.png"
                          alt="Muji"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/rodd&gunn.png"
                          alt="Rodd & Gunn"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/gazman.png"
                          alt="Gaz Man"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* KNIT Section */}
                <div className="customer-category">
                  <h4 className="text-center mb-4">KNIT</h4>
                  <div className="row customer-logos-row justify-content-center align-items-center">
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/chico.png"
                          alt="Chico's"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/drewhouse.png"
                          alt="Drew House"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/the loyalist.png"
                          alt="The Loyalist"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                    <div className="col-6 col-md-3 mb-3">
                      <div className="customer-logo-item">
                        <Image
                          src="/images/branding_our_customer/golf.png"
                          alt="Golf"
                          className="img-fluid customer-logo"
                          width={1920}
                          height={1080}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="certification py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">CERTIFICATION</h2>
          <div className="row">
            {/* Column 1 - LEED Gold */}
            <div className="col-lg-4 mb-4">
              <div className="cert-item leed-cert">
                <Image
                  src="/images/certification/leed_gold.png"
                  alt="LEED Gold Certificate"
                  className="cert-image"
                  width={1920}
                  height={1080}
                />
                <div className="leed-text-container">
                  <div className="leed-text-item">LEADERSHIP IN</div>
                  <div className="leed-text-item">ENERGY &</div>
                  <div className="leed-text-item">ENVIRONMENTAL</div>
                  <div className="leed-text-item">DESIGN</div>
                </div>
              </div>
            </div>

            {/* Column 2 - ISO Certificate */}
            <div className="col-lg-4 mb-4">
              <div className="cert-item iso-cert">
                <Image
                  src="/images/certification/certificate.png"
                  alt="ISO 9001:2015 and ISO 14001:2015"
                  className="cert-image"
                  width={1920}
                  height={1080}
                />
                <div className="iso-text-container">
                  <div className="iso-text-item">ISO 9001: 2015</div>
                  <div className="iso-text-item">ISO 14001: 2015</div>
                </div>
              </div>
            </div>

            {/* Column 3 - Other Certifications */}
            <div className="col-lg-4 mb-4">
              <div className="certifications-list">
                {/* Higg Index */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content higg-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/higg_index.png"
                        alt="Higg Index"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">
                        SUSTAINABLE MANUFACTURING
                      </div>
                    </div>
                  </div>
                </div>

                {/* OEKO-TEX */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content oeko-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/oeko_tex.png"
                        alt="OEKO-TEX Standard 100"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">SAFE & CARING PRODUCTS</div>
                    </div>
                  </div>
                </div>

                {/* EIM Score */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content eim-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/eim_score.png"
                        alt="EIM Score"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">SUSTAINABLE TECHNOLOGY</div>
                    </div>
                  </div>
                </div>

                {/* Sedex */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content sedex-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/sedex.png"
                        alt="Sedex SMETA"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">SOCIAL RESPONSIBILITY</div>
                    </div>
                  </div>
                </div>

                {/* Fast Retailing */}
                <div className="cert-row">
                  <div className="cert-row-content fast-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/fast_retailing.png"
                        alt="Fast Retailing"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">CERTIFIED SUB-CONTRACTOR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news py-5">
        <div className="container">
          <h2 className="section-title text-center">NEWS</h2>
          <div className="row mt-4">
            <div className="col-md-5 mb-4">
              <div className="news-item position-relative">
                <Image
                  src="/images/news/post_1.jpg"
                  alt="News"
                  className="img-fluid w-100"
                  width={1920}
                  height={1080}
                />
                <div className="news-overlay">
                  <h5 className="text-white">SAIGON 3 JEAN LLC</h5>
                  <p className="text-white text-justify mb-3">
                    The company just began operations at the end of 2018. It was
                    built on a 5-hectare campus with a construction floor area
                    of over 51,000m², fully meeting all the standards of a green
                    building according to LEED assessment criteria.
                  </p>
                  <a href="#" className="btn btn-primary">
                    READ MORE
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-7 mb-4">
              <div className="news-list">
                <div className="news-list-item mb-3">
                  <div className="news-item-content">
                    <div className="news-thumbnail">
                      <Image
                        src="/images/news/post_2.png"
                        alt="News Thumbnail"
                        className="img-fluid"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="news-info">
                      <h6 className="news-title">
                        SAIGON 3 JEAN ACHIEVES LEED GOLD CERTIFICATION FOR GREEN
                        MANUFACTURING
                      </h6>
                      <p className="news-excerpt">
                        Our state-of-the-art denim manufacturing facility
                        officially receives LEED Gold certification, reinforcing
                        our commitment to sustainable development and
                        environmental responsibility....
                      </p>
                      <span className="news-date">05/08/2025</span>
                    </div>
                  </div>
                </div>
                <div className="news-list-item mb-3">
                  <div className="news-item-content">
                    <div className="news-thumbnail">
                      <Image
                        src="/images/news/post_3.jpg"
                        alt="News Thumbnail"
                        className="img-fluid"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="news-info">
                      <h6 className="news-title">
                        LAUNCHING ECO-FRIENDLY DENIM COLLECTION FALL 2025
                      </h6>
                      <p className="news-excerpt">
                        Our new denim collection features 100% organic cotton
                        and non-toxic dyeing technology, delivering sustainable
                        fashion choices for modern consumers worldwide....
                      </p>
                      <span className="news-date">03/15/2025</span>
                    </div>
                  </div>
                </div>
                <div className="news-list-item mb-3">
                  <div className="news-item-content">
                    <div className="news-thumbnail">
                      <Image
                        src="/images/news/post_4.png"
                        alt="News Thumbnail"
                        className="img-fluid"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="news-info">
                      <h6 className="news-title">
                        SAIGON 3 JEAN SIGNS STRATEGIC PARTNERSHIP WITH
                        INTERNATIONAL BRANDS
                      </h6>
                      <p className="news-excerpt">
                        The company successfully secured export contracts with
                        leading European fashion brands, expanding global market
                        presence and strengthening international
                        competitiveness....
                      </p>
                      <span className="news-date">02/25/2025</span>
                    </div>
                  </div>
                </div>
                <div className="news-list-item mb-3">
                  <div className="news-item-content">
                    <div className="news-thumbnail">
                      <Image
                        src="/images/news/post_5.png"
                        alt="News Thumbnail"
                        className="img-fluid"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="news-info">
                      <h6 className="news-title">
                        SAIGON 3 JEAN SHOWCASES INNOVATION AT VIETNAM FASHION
                        EXPO 2025
                      </h6>
                      <p className="news-excerpt">
                        Company participates in Vietnam&apos;s largest fashion
                        exhibition, presenting latest denim trends and advanced
                        manufacturing technologies to industry professionals and
                        buyers...
                      </p>
                      <span className="news-date">02/25/2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12 text-center">
              <a href="#" className="btn btn-outline-primary btn-lg px-4">
                View all news
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="contact-box">
                <h4>CONTACT</h4>
                <h5 className="contact-subtitle">Sustainable Partnership</h5>
                <p className="contact-description">
                  We seek like-minded provide high-quality manufacturing
                  services innovation, and work together sustainable growth
                </p>
                <a href="/pages/contact.html" className="btn btn-dark">
                  CONTACT US
                </a>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="work-with-us-box">
                <h4>WORK WITH US</h4>
                <p className="work-description">
                  We are looking for intelligent, passionate individuals who are
                  ready to join us in building and growing the company
                </p>
                <a href="/pages/recruitment.html" className="btn btn-dark">
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
