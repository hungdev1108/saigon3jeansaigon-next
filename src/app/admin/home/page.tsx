// src/app/admin/home/page.tsx
"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'
import EditableSection from '@/components/admin/EditableSection'
import homeService from '@/services/homeService'

interface HeroData {
  title: string
  subtitle: string
  backgroundImage: string
  videoUrl: string
  isActive: boolean
}

interface SectionData {
  title: string
  content: string
  mediaType: string
  mediaUrl: string
  buttonText: string
  buttonLink: string
  backgroundColor: string
  order: number
}

interface HomeData {
  hero: HeroData
  sections: SectionData[]
  customers: any
  certifications: any[]
  featuredNews: any[]
}

export default function AdminHomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('hero')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await homeService.getCompleteHomeData()
      setHomeData(data)
    } catch (error) {
      console.error('Error loading home data:', error)
      setMessage('❌ Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSection = async (section: string, newContent: string) => {
    try {
      setSaving(true)
      console.log('Saving:', section, newContent)
      
      const keys = section.split('.')
      const mainSection = keys[0]
      
      let result
      
      if (mainSection === 'hero') {
        // Update hero section
        const updatedHero = { ...homeData?.hero }
        let current: any = updatedHero
        
        for (let i = 1; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {}
          current = current[keys[i]]
        }
        
        current[keys[keys.length - 1]] = newContent
        result = await homeService.updateHero(updatedHero)
      } else if (mainSection === 'sections') {
        // Update sections
        const sectionIndex = parseInt(keys[1])
        const updatedSections = [...(homeData?.sections || [])]
        
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          [keys[2]]: newContent
        }
        
        result = await homeService.updateHomeSections(updatedSections)
      } else if (mainSection === 'customers') {
        // Update customers
        const updatedCustomers = { ...homeData?.customers }
        const category = keys[1]
        const customerIndex = parseInt(keys[2])
        
        updatedCustomers[category][customerIndex] = {
          ...updatedCustomers[category][customerIndex],
          [keys[3]]: newContent
        }
        
        result = await homeService.updateCustomers(updatedCustomers)
      } else if (mainSection === 'featuredNews') {
        // Update featured news
        const newsIndex = parseInt(keys[1])
        const newsItem = homeData?.featuredNews?.[newsIndex]
        
        if (newsItem?._id) {
          const updatedNews = {
            ...newsItem,
            [keys[2]]: newContent
          }
          
          result = await homeService.updateNews(newsItem._id, updatedNews)
        }
      }
      
      if (result?.success) {
        // Update local state with API response
        setHomeData(prev => {
          if (!prev) return prev
          const updated = { ...prev }
          
          if (mainSection === 'hero') {
            updated.hero = result.data
          } else if (mainSection === 'sections') {
            updated.sections = result.data
          } else if (mainSection === 'customers') {
            updated.customers = result.data
          } else if (mainSection === 'featuredNews' && result.data) {
            const newsIndex = parseInt(keys[1])
            updated.featuredNews[newsIndex] = result.data
          }
          
          return updated
        })
        
        setMessage('✅ Đã lưu thành công!')
      } else {
        throw new Error(result?.message || 'Failed to save')
      }
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      setMessage(`❌ Lỗi khi lưu: ${error.message}`)
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleAddSection = () => {
    if (!homeData) return
    
    const newSection: SectionData = {
      title: 'New Section',
      content: 'Section content...',
      mediaType: 'image',
      mediaUrl: '/images/placeholder.jpg',
      buttonText: 'LEARN MORE',
      buttonLink: '#',
      backgroundColor: '#007bff',
      order: homeData.sections.length
    }
    
    setHomeData(prev => ({
      ...prev!,
      sections: [...prev!.sections, newSection]
    }))
  }

  const handleDeleteSection = (index: number) => {
    if (!homeData) return
    
    setHomeData(prev => ({
      ...prev!,
      sections: prev!.sections.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = async (section: string, file: File) => {
    try {
      setSaving(true)
      console.log('Uploading image for:', section)
      
      const keys = section.split('.')
      const mainSection = keys[0]
      
      let result
      
      if (mainSection === 'hero') {
        // Update hero with new image
        const updatedHero = { ...homeData?.hero }
        result = await homeService.updateHero(updatedHero, file)
      } else if (mainSection === 'sections') {
        // Update section with new image
        const sectionIndex = parseInt(keys[1])
        const updatedSections = [...(homeData?.sections || [])]
        
        result = await homeService.updateHomeSections(updatedSections, { [sectionIndex]: file })
      } else if (mainSection === 'customers') {
        // Update customers with new logo
        const updatedCustomers = { ...homeData?.customers }
        const category = keys[1]
        const customerIndex = parseInt(keys[2])
        
        result = await homeService.updateCustomers(updatedCustomers, { [`${category}_${customerIndex}`]: file })
      } else if (mainSection === 'featuredNews') {
        // Update news with new image
        const newsIndex = parseInt(keys[1])
        const newsItem = homeData?.featuredNews?.[newsIndex]
        
        if (newsItem?._id) {
          result = await homeService.updateNews(newsItem._id, newsItem, file)
        }
      }
      
      if (result?.success) {
        // Update local state with API response
        setHomeData(prev => {
          if (!prev) return prev
          const updated = { ...prev }
          
          if (mainSection === 'hero') {
            updated.hero = result.data
          } else if (mainSection === 'sections') {
            updated.sections = result.data
          } else if (mainSection === 'customers') {
            updated.customers = result.data
          } else if (mainSection === 'featuredNews' && result.data) {
            const newsIndex = parseInt(keys[1])
            updated.featuredNews[newsIndex] = result.data
          }
          
          return updated
        })
        
        setMessage('✅ Đã tải lên hình ảnh thành công!')
      } else {
        throw new Error(result?.message || 'Failed to upload image')
      }
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error uploading image:', error)
      setMessage(`❌ Lỗi khi tải lên: ${error.message}`)
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>🏠 Quản lý Trang Chủ</h1>
        <p>Chỉnh sửa nội dung trang chủ của website</p>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          🎯 Hero Section
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          📄 Content Sections
        </button>
        <button 
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          🏢 Customers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📰 Featured News
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'hero' && (
          <div className="hero-section">
            <h2>🎯 Hero Section</h2>
            
            <EditableSection
              title="Hero Title"
              content={homeData?.hero?.title || ''}
              type="text"
              onSave={(content) => handleSaveSection('hero.title', content)}
            />
            
            <EditableSection
              title="Hero Subtitle"
              content={homeData?.hero?.subtitle || ''}
              type="textarea"
              onSave={(content) => handleSaveSection('hero.subtitle', content)}
            />
            
            <EditableSection
              title="Background Image"
              content={homeData?.hero?.backgroundImage || ''}
              type="image"
              imagePreview={homeData?.hero?.backgroundImage}
              onImageUpload={(file) => handleImageUpload('hero.backgroundImage', file)}
              onSave={(content) => handleSaveSection('hero.backgroundImage', content)}
            />
            
            <EditableSection
              title="Video URL"
              content={homeData?.hero?.videoUrl || ''}
              type="text"
              onSave={(content) => handleSaveSection('hero.videoUrl', content)}
            />
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="sections-tab">
            <div className="section-header">
              <h2>📄 Content Sections</h2>
              <button onClick={handleAddSection} className="add-btn">
                ➕ Thêm Section
              </button>
            </div>
            
            {homeData?.sections?.map((section, index) => (
              <div key={index} className="section-item">
                <div className="section-item-header">
                  <h3>Section {index + 1}</h3>
                  <button 
                    onClick={() => handleDeleteSection(index)}
                    className="delete-btn"
                  >
                    🗑️ Xóa
                  </button>
                </div>
                
                <EditableSection
                  title="Section Title"
                  content={section.title}
                  type="text"
                  onSave={(content) => handleSaveSection(`sections.${index}.title`, content)}
                />
                
                <EditableSection
                  title="Section Content"
                  content={section.content}
                  type="textarea"
                  onSave={(content) => handleSaveSection(`sections.${index}.content`, content)}
                />
                
                <EditableSection
                  title="Media URL"
                  content={section.mediaUrl}
                  type="image"
                  imagePreview={section.mediaUrl}
                  onImageUpload={(file) => handleImageUpload(`sections.${index}.mediaUrl`, file)}
                  onSave={(content) => handleSaveSection(`sections.${index}.mediaUrl`, content)}
                />
                
                <EditableSection
                  title="Media Type"
                  content={section.mediaType}
                  type="text"
                  onSave={(content) => handleSaveSection(`sections.${index}.mediaType`, content)}
                />
                
                <EditableSection
                  title="Background Color"
                  content={section.backgroundColor}
                  type="text"
                  onSave={(content) => handleSaveSection(`sections.${index}.backgroundColor`, content)}
                />
                
                <EditableSection
                  title="Button Text"
                  content={section.buttonText}
                  type="text"
                  onSave={(content) => handleSaveSection(`sections.${index}.buttonText`, content)}
                />
                
                <EditableSection
                  title="Button Link"
                  content={section.buttonLink}
                  type="text"
                  onSave={(content) => handleSaveSection(`sections.${index}.buttonLink`, content)}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="customers-tab">
            <h2>🏢 Customers</h2>
            
            <div className="customer-categories">
              <div className="category">
                <h3>Denim Woven</h3>
                {homeData?.customers?.denimWoven?.map((customer: any, index: number) => (
                  <div key={index} className="customer-item">
                    <EditableSection
                      title={`Customer ${index + 1} - Name`}
                      content={customer.name}
                      onSave={(content) => handleSaveSection(`customers.denimWoven.${index}.name`, content)}
                    />
                    <EditableSection
                      title={`Customer ${index + 1} - Logo`}
                      content={customer.logo}
                      type="image"
                      imagePreview={customer.logo}
                      onImageUpload={(file) => handleImageUpload(`customers.denimWoven.${index}.logo`, file)}
                      onSave={(content) => handleSaveSection(`customers.denimWoven.${index}.logo`, content)}
                    />
                    <EditableSection
                      title={`Customer ${index + 1} - Website`}
                      content={customer.website}
                      onSave={(content) => handleSaveSection(`customers.denimWoven.${index}.website`, content)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="category">
                <h3>Knit</h3>
                {homeData?.customers?.knit?.map((customer: any, index: number) => (
                  <div key={index} className="customer-item">
                    <EditableSection
                      title={`Customer ${index + 1} - Name`}
                      content={customer.name}
                      onSave={(content) => handleSaveSection(`customers.knit.${index}.name`, content)}
                    />
                    <EditableSection
                      title={`Customer ${index + 1} - Logo`}
                      content={customer.logo}
                      type="image"
                      imagePreview={customer.logo}
                      onImageUpload={(file) => handleImageUpload(`customers.knit.${index}.logo`, file)}
                      onSave={(content) => handleSaveSection(`customers.knit.${index}.logo`, content)}
                    />
                    <EditableSection
                      title={`Customer ${index + 1} - Website`}
                      content={customer.website}
                      onSave={(content) => handleSaveSection(`customers.knit.${index}.website`, content)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="news-tab">
            <h2>📰 Featured News</h2>
            
            {homeData?.featuredNews?.map((news: any, index: number) => (
              <div key={index} className="news-item">
                <h3>News {index + 1}</h3>
                
                <EditableSection
                  title="Title"
                  content={news.title}
                  onSave={(content) => handleSaveSection(`featuredNews.${index}.title`, content)}
                />
                
                <EditableSection
                  title="Excerpt"
                  content={news.excerpt}
                  type="textarea"
                  onSave={(content) => handleSaveSection(`featuredNews.${index}.excerpt`, content)}
                />
                
                <EditableSection
                  title="Image"
                  content={news.image}
                  type="image"
                  imagePreview={news.image}
                  onImageUpload={(file) => handleImageUpload(`featuredNews.${index}.image`, file)}
                  onSave={(content) => handleSaveSection(`featuredNews.${index}.image`, content)}
                />
                
                <EditableSection
                  title="Content"
                  content={news.content}
                  type="textarea"
                  onSave={(content) => handleSaveSection(`featuredNews.${index}.content`, content)}
                />
                
                <EditableSection
                  title="Publish Date"
                  content={news.publishDate}
                  onSave={(content) => handleSaveSection(`featuredNews.${index}.publishDate`, content)}
                />
                
                <EditableSection
                  title="Author"
                  content={news.author}
                  onSave={(content) => handleSaveSection(`featuredNews.${index}.author`, content)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="preview-section">
        <h3>🔍 Preview</h3>
        <div className="website-preview">
          <div className="hero-preview">
            <h1>{homeData?.hero?.title}</h1>
            <p>{homeData?.hero?.subtitle}</p>
          </div>
          <div className="sections-preview">
            {homeData?.sections?.map((section, index) => (
              <div key={index} className="section-preview">
                <h3>{section.title}</h3>
                <p>{section.content}</p>
                <button>{section.buttonText}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}