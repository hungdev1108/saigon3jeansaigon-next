// const axios = require("axios");

const BASE_URL = "http://localhost:5001";

// Mock productsService để test
class MockProductsService {
  fixImagePath(imagePath) {
    if (!imagePath) return "";

    // Nếu đã có http thì giữ nguyên
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Nếu đã có /uploads/ thì thêm base URL
    if (imagePath.startsWith("/uploads/")) {
      return `http://localhost:5001${imagePath}`;
    }

    // Fallback cho đường dẫn cũ - tất cả đều chuyển về backend
    return `http://localhost:5001${imagePath}`;
  }

  processProductDetails(productData) {
    if (!productData) return this.getDefaultProductDetails();

    return {
      id: productData._id || productData.id || "",
      name: productData.name || "",
      slug: productData.slug || "",
      description: productData.description || "",
      mainImage:
        this.fixImagePath(productData.mainImage) ||
        "/images/placeholder-product.jpg",
      mainImageAlt: productData.mainImageAlt || `${productData.name} Products`,
      galleryImages: this.processGalleryImages(productData.galleryImages),
      features: this.processProductFeatures(productData.features),
      applications: this.processProductApplications(productData.applications),
      carouselSettings: this.processCarouselSettings(
        productData.carouselSettings
      ),
      seo: this.processProductSEO(productData.seo),
      order: productData.order || 0,
      isActive: productData.isActive !== false,
      isFeatured: productData.isFeatured || false,
      createdAt: productData.createdAt || null,
      updatedAt: productData.updatedAt || null,
    };
  }

  processGalleryImages(imagesData) {
    if (!Array.isArray(imagesData)) return [];

    return imagesData
      .filter((image) => image.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((image) => ({
        id: image._id || "",
        url: this.fixImagePath(image.url) || "/images/placeholder-product.jpg",
        alt: image.alt || "Product Image",
        order: image.order || 0,
        isActive: image.isActive !== false,
      }));
  }

  processProductFeatures(featuresData) {
    if (!Array.isArray(featuresData)) return [];

    return featuresData
      .filter((feature) => feature.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((feature) => ({
        id: feature._id || "",
        icon: feature.icon || "fas fa-check",
        text: feature.text || "",
        order: feature.order || 0,
      }));
  }

  processProductApplications(applicationsData) {
    if (!Array.isArray(applicationsData)) return [];

    return applicationsData
      .filter((app) => app.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((app, index) => ({
        id: app._id || `app-${index}`,
        title: app.title || "",
        content: {
          heading: app.content?.heading || app.title || "",
          description: app.content?.description || "",
          features: Array.isArray(app.content?.features)
            ? app.content.features
            : [],
          image:
            this.fixImagePath(app.content?.image) ||
            "/images/placeholder-application.jpg",
          imageAlt: app.content?.imageAlt || `${app.title} Image`,
        },
        order: app.order || index + 1,
        accordionId: `application${index + 1}`,
        isExpanded: index === 0, // Mở accordion đầu tiên
      }));
  }

  processCarouselSettings(carouselData) {
    if (!carouselData) return this.getDefaultCarouselSettings();

    return {
      interval: carouselData.interval || 3000,
      autoplay: carouselData.autoplay !== false,
      showIndicators: carouselData.showIndicators !== false,
      showControls: carouselData.showControls || false,
    };
  }

  processProductSEO(seoData) {
    if (!seoData) return this.getDefaultProductSEO();

    return {
      metaTitle: seoData.metaTitle || "",
      metaDescription: seoData.metaDescription || "",
      keywords: Array.isArray(seoData.keywords) ? seoData.keywords : [],
    };
  }

  getDefaultCarouselSettings() {
    return {
      interval: 3000,
      autoplay: true,
      showIndicators: true,
      showControls: false,
    };
  }

  getDefaultProductSEO() {
    return {
      metaTitle: "DENIM - Saigon 3 Jean",
      metaDescription:
        "Sensors continuously record data on chemical levels, temperature, pressure, and flow rate.",
      keywords: ["denim", "manufacturing", "quality", "sustainable"],
    };
  }

  hasFeatures(product) {
    return product.features && product.features.length > 0;
  }

  hasApplications(product) {
    return product.applications && product.applications.length > 0;
  }
}

// Test tích hợp product details
async function testProductDetailsIntegration() {
  console.log("🧪 Testing Product Details Integration...\n");

  const service = new MockProductsService();

  try {
    // Test 1: Lấy và xử lý dữ liệu product details
    console.log("📋 Test 1: Get and process product details");
    const productId = "6844f825dd5153c76d279421";

    try {
      const response = await axios.get(`${BASE_URL}/api/products/${productId}`);

      if (response.data.success) {
        const rawData = response.data.data;
        const processedData = service.processProductDetails(rawData);

        console.log("✅ Product details processed successfully");
        console.log(`   - Processed Name: ${processedData.name}`);
        console.log(`   - Processed Main Image: ${processedData.mainImage}`);
        console.log(
          `   - Gallery Images: ${processedData.galleryImages.length} processed`
        );
        console.log(
          `   - Features: ${processedData.features.length} processed`
        );
        console.log(
          `   - Applications: ${processedData.applications.length} processed`
        );

        // Test image path processing
        if (processedData.galleryImages.length > 0) {
          console.log(
            `   - First gallery image URL: ${processedData.galleryImages[0].url}`
          );
        }

        // Test features processing
        if (processedData.features.length > 0) {
          console.log(
            `   - First feature icon: ${processedData.features[0].icon}`
          );
          console.log(
            `   - First feature text: ${processedData.features[0].text.substring(
              0,
              40
            )}...`
          );
        }

        // Test applications processing
        if (processedData.applications.length > 0) {
          const firstApp = processedData.applications[0];
          console.log(`   - First application title: ${firstApp.title}`);
          console.log(
            `   - First application accordion ID: ${firstApp.accordionId}`
          );
          console.log(
            `   - First application expanded: ${firstApp.isExpanded}`
          );
          console.log(
            `   - Application content features: ${firstApp.content.features.length} items`
          );
        }

        // Test helper methods
        console.log(`   - Has features: ${service.hasFeatures(processedData)}`);
        console.log(
          `   - Has applications: ${service.hasApplications(processedData)}`
        );
      } else {
        console.log("❌ Failed to get product details");
      }
    } catch (error) {
      console.log("❌ Error in test 1:", error.message);
    }

    console.log("\n" + "=".repeat(50) + "\n");

    // Test 2: Test xử lý hình ảnh
    console.log("📋 Test 2: Test image path processing");

    const testImages = [
      "/uploads/images/product-page/denim_1.png",
      "https://images.unsplash.com/photo-1542272604-787c3835535d",
      "/images/product-page/denim_2.png",
      "",
      null,
    ];

    testImages.forEach((imagePath, index) => {
      const processed = service.fixImagePath(imagePath);
      console.log(`   Test ${index + 1}: "${imagePath}" → "${processed}"`);
    });

    console.log("\n" + "=".repeat(50) + "\n");

    // Test 3: Test carousel settings processing
    console.log("📋 Test 3: Test carousel settings processing");

    const testCarouselSettings = [
      { interval: 5000, autoplay: true, showIndicators: false },
      { interval: 2000 },
      null,
      {},
    ];

    testCarouselSettings.forEach((settings, index) => {
      const processed = service.processCarouselSettings(settings);
      console.log(`   Test ${index + 1}:`, processed);
    });

    console.log("\n" + "=".repeat(50) + "\n");

    // Test 4: Test SEO processing
    console.log("📋 Test 4: Test SEO processing");

    const testSEOData = [
      {
        metaTitle: "Custom Title",
        metaDescription: "Custom Description",
        keywords: ["test", "seo"],
      },
      { metaTitle: "Only Title" },
      null,
      {},
    ];

    testSEOData.forEach((seoData, index) => {
      const processed = service.processProductSEO(seoData);
      console.log(`   Test ${index + 1}:`, processed);
    });

    console.log("\n🎉 Product Details Integration test completed!");
  } catch (error) {
    console.error("❌ Integration test failed:", error.message);
  }
}

// Chạy test
if (require.main === module) {
  testProductDetailsIntegration();
}

module.exports = testProductDetailsIntegration;
