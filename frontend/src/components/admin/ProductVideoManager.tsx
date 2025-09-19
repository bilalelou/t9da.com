'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Play, 
  Edit, 
  Trash2, 
  Star, 
  GripVertical,
  Youtube,
  Video,
  ExternalLink,
  Plus,
  Save,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductVideo {
  id: number;
  title: string;
  description: string;
  video_type: 'file' | 'local' | 'youtube' | 'vimeo';
  video_url: string;
  embed_url: string;
  thumbnail_url: string;
  duration: string;
  file_size: string;
  resolution: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

interface ProductVideoManagerProps {
  productId: number;
  productTitle: string;
}

export default function ProductVideoManager({ productId, productTitle }: ProductVideoManagerProps) {
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ProductVideo | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_type: 'local' as 'file' | 'local' | 'youtube' | 'vimeo',
    video_url: '',
    duration: '',
    resolution: '',
    sort_order: 0,
    is_featured: false,
    is_active: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [productId]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/videos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data.data);
      }
    } catch (error) {
      toast.error('خطأ في تحميل الفيديوهات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submitData.append(key, value.toString());
      }
    });

    // Add files
    if (selectedFile) {
      submitData.append('video_file', selectedFile);
    }
    if (selectedThumbnail) {
      submitData.append('thumbnail', selectedThumbnail);
    }

    try {
      const url = editingVideo 
        ? `/api/products/${productId}/videos/${editingVideo.id}`
        : `/api/products/${productId}/videos`;
        
      const method = editingVideo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        resetForm();
        fetchVideos();
      } else {
        toast.error(result.message || 'حدث خطأ');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    }
  };

  const handleDelete = async (videoId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;

    try {
      const response = await fetch(`/api/products/${productId}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchVideos();
      } else {
        toast.error(result.message || 'حدث خطأ');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_type: 'youtube',
      video_url: '',
      duration: '',
      resolution: '',
      sort_order: 0,
      is_featured: false,
      is_active: true,
    });
    setSelectedFile(null);
    setSelectedThumbnail(null);
    setShowAddForm(false);
    setEditingVideo(null);
  };

  const startEdit = (video: ProductVideo) => {
    setFormData({
      title: video.title || '',
      description: video.description || '',
      video_type: video.video_type,
      video_url: video.video_url,
      duration: '',
      resolution: video.resolution || '',
      sort_order: video.sort_order,
      is_featured: video.is_featured,
      is_active: video.is_active,
    });
    setEditingVideo(video);
    setShowAddForm(true);
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

  const getEmbedPreview = (video: ProductVideo) => {
    if (video.video_type === 'file' || video.video_type === 'local') {
      return (
        <video 
          className="w-full h-32 object-cover rounded"
          poster={video.thumbnail_url}
          controls
        >
          <source src={video.embed_url} type="video/mp4" />
        </video>
      );
    } else {
      return (
        <iframe
          src={video.embed_url}
          className="w-full h-32 rounded"
          frameBorder="0"
          allowFullScreen
        />
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>إدارة فيديوهات المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">جاري التحميل...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>فيديوهات المنتج: {productTitle}</CardTitle>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة فيديو
          </Button>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد فيديوهات لهذا المنتج
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card key={video.id} className="relative">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Video Preview */}
                      <div className="relative">
                        {getEmbedPreview(video)}
                        {video.is_featured && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500">
                            <Star className="h-3 w-3 mr-1" />
                            مميز
                          </Badge>
                        )}
                      </div>

                      {/* Video Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getVideoIcon(video.video_type)}
                          <h3 className="font-medium truncate">
                            {video.title || 'فيديو بدون عنوان'}
                          </h3>
                        </div>
                        
                        {video.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {video.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {video.duration && (
                            <span>{video.duration}</span>
                          )}
                          {video.file_size && (
                            <span>{video.file_size}</span>
                          )}
                          {video.resolution && (
                            <span>{video.resolution}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <Badge variant={video.is_active ? "default" : "secondary"}>
                            {video.is_active ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(video)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(video.embed_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(video.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Video Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingVideo ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الفيديو</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="عنوان الفيديو"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_type">نوع الفيديو</Label>
                  <Select 
                    value={formData.video_type} 
                    onValueChange={(value: 'file' | 'youtube' | 'vimeo') => 
                      setFormData(prev => ({ ...prev, video_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="local">ملف محلي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الفيديو</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف الفيديو"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">رابط/URL الفيديو</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder={
                    formData.video_type === 'youtube' 
                      ? 'https://www.youtube.com/watch?v=...'
                      : formData.video_type === 'vimeo'
                      ? 'https://vimeo.com/...'
                      : 'سيتم تحديد الرابط تلقائياً عند رفع الملف'
                  }
                  disabled={formData.video_type === 'file' || formData.video_type === 'local'}
                />
              </div>

              {(formData.video_type === 'file' || formData.video_type === 'local') && (
                <div className="space-y-2">
                  <Label htmlFor="video_file">ملف الفيديو</Label>
                  <Input
                    id="video_file"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-500">
                    الحد الأقصى للملف: 100 ميجا. الصيغ المدعومة: mp4, mov, avi, wmv
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="thumbnail">صورة مصغرة (اختياري)</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resolution">الدقة</Label>
                  <Input
                    id="resolution"
                    value={formData.resolution}
                    onChange={(e) => setFormData(prev => ({ ...prev, resolution: e.target.value }))}
                    placeholder="مثل: 1920x1080"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">ترتيب العرض</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="is_featured">فيديو مميز</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">نشط</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingVideo ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}