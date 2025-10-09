"use client";

import { useEffect, useRef } from 'react';
import { BACKEND_DOMAIN } from '@/api/config';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;
}

// Load external scripts/styles only once
function loadCdnOnce(): Promise<void> {
  const ensureLink = (href: string) => {
    return new Promise<void>((resolve) => {
      if (document.querySelector(`link[href="${href}"]`)) return resolve();
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  };
  const ensureScript = (src: string) => {
    return new Promise<void>((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  // Summernote (requires jQuery and Bootstrap 4)
  return Promise.resolve()
    .then(() => ensureLink('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/css/bootstrap.min.css'))
    .then(() => ensureLink('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-bs4.min.css'))
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js'))
    .then(() => {
      // Ensure global aliases
      const w = (window as any);
      if (w.jQuery && !w.$) w.$ = w.jQuery;
      if (w.$ && !w.jQuery) w.jQuery = w.$;
    })
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/popper.min.js'))
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/js/bootstrap.min.js'))
    .then(() => ensureScript('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-bs4.min.js'));
}

export default function RichTextEditor({ value, onChange, placeholder = 'Nhập mô tả...', height = 300 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

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

    loadCdnOnce().then(waitForSummernote).then(() => {
      if (destroyed || !editorRef.current) return;
      const $ = (window as any).$;

      // Ensure overlay styles so dialogs sit above admin modal
      const styleId = 'summernote-modal-zfix';
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

      // Set initial content
      $(editorRef.current).summernote('code', value || '');
    });

    return () => {
      destroyed = true;
      try {
        const $ = (window as any).$;
        if ($ && editorRef.current) {
          $(editorRef.current).summernote('destroy');
        }
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep external updates in sync
  useEffect(() => {
    const $ = (window as any).$;
    if ($ && editorRef.current) {
      const current = $(editorRef.current).summernote('code');
      if (current !== value) {
        $(editorRef.current).summernote('code', value || '');
      }
    }
  }, [value]);

  return (
    <div>
      <div ref={editorRef} />
    </div>
  );
}


