"use client";

import { useEffect, useRef } from 'react';
import { BACKEND_DOMAIN } from '@/api/config';

interface RichTextEditorEditProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;
}

// Load external scripts/styles only once
function loadCdnOnce(): Promise<void> {
  const ensureLink = (href: string) => {
    return new Promise<void>((resolve) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
    });
  };

  const ensureScript = (src: string) => {
    return new Promise<void>((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  };

  return ensureLink('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/css/bootstrap.min.css')
    .then(() => ensureLink('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-bs4.min.css'))
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js'))
    .then(() => {
      // Ensure window.$ and window.jQuery are available
      const w = window as any;
      if (w.jQuery && !w.$) {
        w.$ = w.jQuery;
      }
    })
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/popper.min.js'))
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/js/bootstrap.min.js'))
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-bs4.min.js'));
}

export default function RichTextEditorEdit({ value, onChange, placeholder = 'Nhập mô tả...', height = 300 }: RichTextEditorEditProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const isInitializedRef = useRef(false);
  const lastValueRef = useRef(value);

  // Initialize summernote for EDIT mode only
  useEffect(() => {
    let destroyed = false;
    const waitForSummernote = () => new Promise<void>((resolve) => {
      const check = () => {
        const w = (window as any);
        if (w.$ && w.$.fn && w.$.fn.summernote) return resolve();
        setTimeout(check, 50);
      };
      check();
    });

    const initializeEditor = () => {
      if (destroyed || !editorRef.current) return;
      const $ = (window as any).$;

      // Ensure overlay styles so dialogs sit above admin modal
      const styleId = 'summernote-modal-zfix-edit';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .note-modal, .note-modal .modal, .note-popover, .note-editor .dropdown-menu { z-index: 2147483647 !important; }
          .note-modal-backdrop, .modal-backdrop { z-index: 2147483646 !important; pointer-events: none !important; }
        `;
        document.head.appendChild(style);
      }

      // Initialize summernote
      $(editorRef.current).summernote({
        placeholder,
        height,
        dialogsInBody: true,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['link', 'picture', 'video', 'hr']],
          ['view', ['fullscreen', 'codeview']]
        ],
        callbacks: {
          onChange: function(contents: string) {
            onChange(contents || '');
          },
          onImageUpload: async function(files: File[]) {
            for (const file of files) {
              try {
                const fd = new FormData();
                fd.append('image', file);
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const res = await fetch(`${BACKEND_DOMAIN}/api/upload/single`, {
                  method: 'POST',
                  headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
                  body: fd,
                });
                const data = await res.json();
                if (data && data.success && data.url) {
                  $(editorRef.current).summernote('insertImage', `${BACKEND_DOMAIN}${data.url}`);
                } else {
                  console.error('Upload failed response:', data);
                }
              } catch (e) {
                console.error('Image upload failed', e);
              }
            }
          }
        }
      });

      isInitializedRef.current = true;
      lastValueRef.current = value;
      // Load the existing content for EDIT mode
      $(editorRef.current).summernote('code', value || '');
    };

    loadCdnOnce().then(waitForSummernote).then(initializeEditor);

    return () => {
      destroyed = true;
      isInitializedRef.current = false;
      try {
        const $ = (window as any).$;
        if ($ && editorRef.current) {
          $(editorRef.current).summernote('destroy');
        }
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initialize only once for EDIT mode

  // Handle value changes - force update when value changes significantly
  useEffect(() => {
    const $ = (window as any).$;
    if ($ && editorRef.current && isInitializedRef.current) {
      // Always update content when value prop changes
      const currentContent = $(editorRef.current).summernote('code');
      if (currentContent !== value) {
        $(editorRef.current).summernote('code', value || '');
        lastValueRef.current = value;
      }
    }
  }, [value]);

  return (
    <div>
      <div ref={editorRef} />
    </div>
  );
}
