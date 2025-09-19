'use client';

import React, { useEffect } from 'react';
import { Play } from 'lucide-react';

interface ProductVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  video_type?: string;
  thumbnail_url?: string;
  duration?: string;
  sort_order?: number;
  is_featured: boolean;
  is_active: boolean;
}

interface ProductVideoGalleryProps {
  productId: number;
  onVideosLoaded?: (videos: ProductVideo[]) => void;
  className?: string;
}

export default function ProductVideoGallery({ productId, onVideosLoaded }: ProductVideoGalleryProps) {
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/?$/, '') || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${API_BASE}/products/${productId}/videos`);

        if (response.ok) {
          const data = await response.json();
          const activeVideos = data.data.filter((video: ProductVideo) => video.is_active);
          
          // إرسال الفيديوهات للمكون الأب
          if (onVideosLoaded) {
            onVideosLoaded(activeVideos);
          }
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, [productId, onVideosLoaded]);

  // هذا المكون الآن لا يعرض شيئاً مرئياً، بل يرسل البيانات للمكون الأب
  return null;
}

// مكون منفصل لعرض الفيديو في المودال أو العرض الرئيسي
export function VideoPlayer({ video, className = '' }: { video: ProductVideo; className?: string }) {
  const renderVideoPlayer = () => {
    if (video.video_type === 'local' || video.video_type === 'file') {
      return (
        <video 
          className="w-full h-full object-cover"
          poster={video.thumbnail_url}
          controls
          key={video.id}
        >
          <source src={video.video_url} type="video/mp4" />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      );
    } else {
      return (
        <iframe
          src={video.video_url}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          key={video.id}
        />
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {renderVideoPlayer()}
    </div>
  );
}

// مكون للصورة المصغرة للفيديو
export function VideoThumbnail({ 
  video, 
  isSelected = false, 
  onClick 
}: { 
  video: ProductVideo; 
  isSelected?: boolean; 
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all
        ${isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-transparent hover:border-gray-300'
        }
      `}
    >
      {video.thumbnail_url ? (
        <img
          src={video.thumbnail_url}
          alt={video.title || 'فيديو'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <Play className="h-6 w-6 text-white" />
        </div>
      )}
      
      {/* أيقونة التشغيل */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Play className="h-4 w-4 text-white fill-current ml-0.5" />
        </div>
      </div>
      
      {/* المدة إذا كانت متوفرة */}
      {video.duration && (
        <div className="absolute bottom-1 right-1 text-xs text-white bg-black/60 px-1 rounded">
          {video.duration}
        </div>
      )}
    </div>
  );
}