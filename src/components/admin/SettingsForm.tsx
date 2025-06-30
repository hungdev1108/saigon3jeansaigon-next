// src/components/admin/SettingsForm.tsx
"use client";

import { useState, useEffect } from 'react'

interface SettingsData {
  siteName: string
  logo: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    facebook: string
    instagram: string
    linkedin: string
  }
  footerText: string
}

const defaultSettings: SettingsData = {
  siteName: 'Saigon 3 Jeans',
  logo: '/images/sg3jeans_logo.png',
  contactEmail: 'info@saigon3jeans.com',
  contactPhone: '+84 123 456 789',
  address: 'Ho Chi Minh City, Vietnam',
  socialMedia: {
    facebook: 'https://facebook.com/saigon3jeans',
    instagram: 'https://instagram.com/saigon3jeans',
    linkedin: 'https://linkedin.com/company/saigon3jeans'
  },
  footerText: '© 2024 Saigon 3 Jeans. All rights reserved.'
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (field: keyof SettingsData, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialMediaChange = (platform: keyof SettingsData['socialMedia'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Gọi API để lưu settings
      // await saveSettings(settings)
      
      // Tạm thời lưu vào localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      
      setMessage('✅ Cài đặt đã được lưu thành công!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('❌ Có lỗi xảy ra khi lưu cài đặt')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load settings từ localStorage hoặc API
    const savedSettings = localStorage.getItem('adminSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  return (
    <div className="settings-form">
      <h2>Cài đặt Website</h2>
      
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="form-section">
        <h3>🏢 Thông tin chung</h3>
        
        <div className="form-group">
          <label>Tên website:</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Logo URL:</label>
          <input
            type="text"
            value={settings.logo}
            onChange={(e) => handleInputChange('logo', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>📞 Thông tin liên hệ</h3>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="tel"
            value={settings.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ:</label>
          <textarea
            value={settings.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="form-textarea"
            rows={3}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>📱 Mạng xã hội</h3>
        
        <div className="form-group">
          <label>Facebook:</label>
          <input
            type="url"
            value={settings.socialMedia.facebook}
            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Instagram:</label>
          <input
            type="url"
            value={settings.socialMedia.instagram}
            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn:</label>
          <input
            type="url"
            value={settings.socialMedia.linkedin}
            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>📄 Footer</h3>
        
        <div className="form-group">
          <label>Văn bản footer:</label>
          <textarea
            value={settings.footerText}
            onChange={(e) => handleInputChange('footerText', e.target.value)}
            className="form-textarea"
            rows={2}
          />
        </div>
      </div>

      <div className="form-actions">
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="save-button"
        >
          {isLoading ? '⏳ Đang lưu...' : '💾 Lưu cài đặt'}
        </button>
      </div>
    </div>
  )
}