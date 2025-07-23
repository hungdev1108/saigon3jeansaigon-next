// src/components/admin/EditableSection.tsx
"use client";

import { useState } from 'react'
import Image from "next/image"

interface EditableSectionProps {
  title: string
  content: string
  onSave: (newContent: string) => void
  onImageUpload?: (file: File) => void
  type?: 'text' | 'textarea' | 'image'
  imagePreview?: string
}

function EditableSection({ 
  title, 
  content, 
  onSave, 
  onImageUpload,
  type = 'text',
  imagePreview
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const handleSave = () => {
    onSave(editContent)
    setIsEditing(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImageUpload) {
      onImageUpload(file)
      setIsEditing(false)
    }
  }

  return (
    <div className="editable-section">
      <div className="section-header">
        <h4>{title}</h4>
        <button 
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '❌' : '✏️'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="edit-mode">
          {type === 'image' ? (
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imagePreview && (
                <div className="image-preview">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    width={200} 
                    height={200}
                    style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'contain'}} 
                  />
                </div>
              )}
            </div>
          ) : type === 'textarea' ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-textarea"
            />
          ) : (
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-input"
            />
          )}
          {type !== 'image' && (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">💾 Lưu</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">❌ Hủy</button>
            </div>
          )}
        </div>
      ) : (
        <div className="view-mode">
          {type === 'image' && imagePreview ? (
            <div className="image-display">
              <Image 
                src={imagePreview} 
                alt={title} 
                width={300} 
                height={200}
                style={{maxWidth: '300px', maxHeight: '200px', objectFit: 'contain'}} 
              />
              <p className="image-path">{content}</p>
            </div>
          ) : (
            <p>{content}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default EditableSection