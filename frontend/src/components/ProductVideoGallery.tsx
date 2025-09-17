'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Youtube,
  Video,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProductVideo {
  id: number;
  title: string;
  description: string;
  video_type: 'file' | 'youtube' | 'vimeo';
  embed_url: string;
  thumbnail_url: string;
  duration: string;
  is_featured: boolean;
  is_active: boolean;
}

interface ProductVideoGalleryProps {
  productId: number;
  className?: string;
}

export default function ProductVideoGallery({ productId, className = '' }: ProductVideoGalleryProps) {
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<ProductVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, [productId]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/videos`);

      if (response.ok) {
        const data = await response.json();
        const activeVideos = data.data.filter((video: ProductVideo) => video.is_active);
        setVideos(activeVideos);
        
        // Set featured video as default or first video
        const featuredVideo = activeVideos.find((video: ProductVideo) => video.is_featured);
        if (featuredVideo) {
          setSelectedVideo(featuredVideo);
          setCurrentIndex(activeVideos.indexOf(featuredVideo));
        } else if (activeVideos.length > 0) {
          setSelectedVideo(activeVideos[0]);
          setCurrentIndex(0);
        }
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectVideo = (video: ProductVideo, index: number) => {
    setSelectedVideo(video);
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const nextVideo = () => {
    if (videos.length > 1) {
      const nextIndex = (currentIndex + 1) % videos.length;
      selectVideo(videos[nextIndex], nextIndex);
    }
  };

  const prevVideo = () => {
    if (videos.length > 1) {
      const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
      selectVideo(videos[prevIndex], prevIndex);
    }
  };

  const getVideoIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600" />;
      case 'vimeo':
        return <Video className="h-4 w-4 text-blue-600" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const renderVideoPlayer = () => {
    if (!selectedVideo) return null;

    if (selectedVideo.video_type === 'file') {
      return (
        <video 
          className="w-full h-full object-cover rounded-lg"
          poster={selectedVideo.thumbnail_url}
          controls
          key={selectedVideo.id}
        >
          <source src={selectedVideo.embed_url} type="video/mp4" />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      );
    } else {
      return (
        <iframe
          src={selectedVideo.embed_url}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          key={selectedVideo.id}
        />
      );
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-16 w-24"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return null; // Don't show anything if no videos
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Video Player Section */}
          <div className="relative">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {renderVideoPlayer()}
              
              {/* Video Navigation Arrows */}
              {videos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevVideo}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextVideo}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Video Info Overlay */}
              {selectedVideo && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      {getVideoIcon(selectedVideo.video_type)}
                      <h3 className="font-medium">
                        {selectedVideo.title || 'فيديو المنتج'}
                      </h3>
                      {selectedVideo.is_featured && (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                          <Star className="h-3 w-3 mr-1" />
                          مميز
                        </Badge>
                      )}
                    </div>
                    
                    {selectedVideo.description && (
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {selectedVideo.description}
                      </p>
                    )}
                    
                    {selectedVideo.duration && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {selectedVideo.duration}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Thumbnails List */}
          {videos.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">فيديوهات أخرى</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => selectVideo(video, index)}
                    className={`
                      relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all
                      ${selectedVideo?.id === video.id 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
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
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        {getVideoIcon(video.video_type)}
                      </div>
                    )}
                    
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Featured badge */}
                    {video.is_featured && (
                      <div className="absolute top-1 right-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                    )}
                    
                    {/* Duration */}
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1 rounded">
                        {video.duration}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video Counter */}
          {videos.length > 1 && (
            <div className="text-center text-sm text-gray-500">
              فيديو {currentIndex + 1} من {videos.length}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}