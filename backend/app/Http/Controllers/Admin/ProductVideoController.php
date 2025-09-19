<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductVideoController extends Controller
{
    /**
     * Display videos for a specific product
     */
    public function index(Product $product)
    {
        $videos = $product->videos()->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $videos->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_type' => $video->video_type,
                    'video_url' => $video->full_video_url, // Use full URL for proper access
                    'embed_url' => $video->embed_url,
                    'thumbnail_url' => $video->thumbnail_url,
                    'duration' => $video->formatted_duration,
                    'file_size' => $video->formatted_file_size,
                    'resolution' => $video->resolution,
                    'sort_order' => $video->sort_order,
                    'is_featured' => $video->is_featured,
                    'is_active' => $video->is_active,
                    'created_at' => $video->created_at,
                ];
            })
        ]);
    }

    /**
     * Store a new video for a product
     */
    public function store(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'video_type' => 'required|in:file,youtube,vimeo',
            'video_url' => 'required|string',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:100000', // 100MB max
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'duration' => 'nullable|integer|min:0',
            'resolution' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            $data['product_id'] = $product->id;

            // Handle file upload for local videos
            if ($request->video_type === 'file' && $request->hasFile('video_file')) {
                $videoFile = $request->file('video_file');
                $videoFileName = 'videos/' . Str::uuid() . '.' . $videoFile->getClientOriginalExtension();
                $videoPath = $videoFile->storeAs('public', $videoFileName);
                $data['video_url'] = $videoFileName;
                $data['file_size'] = $videoFile->getSize();
            }

            // Handle thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $thumbnailFile = $request->file('thumbnail');
                $thumbnailFileName = 'video-thumbnails/' . Str::uuid() . '.' . $thumbnailFile->getClientOriginalExtension();
                $thumbnailPath = $thumbnailFile->storeAs('public', $thumbnailFileName);
                $data['thumbnail'] = $thumbnailFileName;
            }

            // If this is set as featured, remove featured from other videos
            if ($data['is_featured'] ?? false) {
                ProductVideo::where('product_id', $product->id)
                    ->where('is_featured', true)
                    ->update(['is_featured' => false]);
            }

            $video = ProductVideo::create($data);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الفيديو بنجاح',
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_type' => $video->video_type,
                    'video_url' => $video->full_video_url, // Use full URL for consistency
                    'thumbnail_url' => $video->thumbnail_url,
                    'embed_url' => $video->embed_url,
                    'sort_order' => $video->sort_order,
                    'is_featured' => $video->is_featured,
                    'is_active' => $video->is_active,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة الفيديو: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a video
     */
    public function update(Request $request, Product $product, ProductVideo $video)
    {
        // Ensure video belongs to the product
        if ($video->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'الفيديو غير موجود لهذا المنتج'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'video_type' => 'sometimes|in:file,youtube,vimeo',
            'video_url' => 'sometimes|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'duration' => 'nullable|integer|min:0',
            'resolution' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // Handle thumbnail upload
            if ($request->hasFile('thumbnail')) {
                // Delete old thumbnail
                if ($video->thumbnail) {
                    Storage::disk('public')->delete($video->thumbnail);
                }

                $thumbnailFile = $request->file('thumbnail');
                $thumbnailFileName = 'video-thumbnails/' . Str::uuid() . '.' . $thumbnailFile->getClientOriginalExtension();
                $thumbnailPath = $thumbnailFile->storeAs('public', $thumbnailFileName);
                $data['thumbnail'] = $thumbnailFileName;
            }

            // If this is set as featured, remove featured from other videos
            if (($data['is_featured'] ?? false) && !$video->is_featured) {
                ProductVideo::where('product_id', $product->id)
                    ->where('id', '!=', $video->id)
                    ->where('is_featured', true)
                    ->update(['is_featured' => false]);
            }

            $video->update($data);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الفيديو بنجاح',
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'video_type' => $video->video_type,
                    'thumbnail_url' => $video->thumbnail_url,
                    'embed_url' => $video->embed_url,
                    'is_featured' => $video->is_featured,
                    'is_active' => $video->is_active,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الفيديو: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a video
     */
    public function destroy(Product $product, ProductVideo $video)
    {
        // Ensure video belongs to the product
        if ($video->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'الفيديو غير موجود لهذا المنتج'
            ], 404);
        }

        try {
            // Delete associated files
            if ($video->video_type === 'file' && $video->video_url) {
                Storage::disk('public')->delete($video->video_url);
            }

            if ($video->thumbnail) {
                Storage::disk('public')->delete($video->thumbnail);
            }

            $video->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الفيديو بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الفيديو: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update videos order
     */
    public function updateOrder(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'videos' => 'required|array',
            'videos.*.id' => 'required|integer|exists:product_videos,id',
            'videos.*.sort_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            foreach ($request->videos as $videoData) {
                ProductVideo::where('id', $videoData['id'])
                    ->where('product_id', $product->id)
                    ->update(['sort_order' => $videoData['sort_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث ترتيب الفيديوهات بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الترتيب: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get video details for embed
     */
    public function show(Product $product, ProductVideo $video)
    {
        // Ensure video belongs to the product
        if ($video->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'الفيديو غير موجود لهذا المنتج'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'video_type' => $video->video_type,
                'embed_url' => $video->embed_url,
                'thumbnail_url' => $video->thumbnail_url,
                'duration' => $video->formatted_duration,
                'file_size' => $video->formatted_file_size,
                'resolution' => $video->resolution,
                'is_featured' => $video->is_featured,
                'is_active' => $video->is_active,
            ]
        ]);
    }

    /**
     * Upload a video file for the product
     */
    public function uploadVideo(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'video_file' => 'required|file|mimes:mp4,avi,mov,wmv,flv,webm|max:102400', // 100MB max
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'sort_order' => 'nullable|integer|min:0',
                'is_featured' => 'nullable|in:0,1,true,false', // قبول 0,1,true,false
            ]);

            $videoFile = $request->file('video_file');

            // Generate unique filename
            $fileName = 'videos/' . uniqid() . '_' . time() . '.' . $videoFile->getClientOriginalExtension();

            // Store the video file
            $path = $videoFile->storeAs('public', $fileName);

            if (!$path) {
                throw new \Exception('فشل في رفع الملف');
            }

            // Create video record - store the file name without 'videos/' prefix for consistency
            $isFeatured = in_array($validated['is_featured'] ?? false, ['1', 'true', true], true);

            $data = [
                'product_id' => $product->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? '',
                'video_url' => $fileName, // Store just the filename path
                'video_type' => 'local',
                'sort_order' => $validated['sort_order'] ?? 0,
                'is_featured' => $isFeatured,
                'is_active' => true,
            ];

            // If this is featured, remove featured from other videos
            if ($isFeatured) {
                ProductVideo::where('product_id', $product->id)
                    ->where('is_featured', true)
                    ->update(['is_featured' => false]);
            }

            $video = ProductVideo::create($data);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الفيديو بنجاح',
                'data' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'video_url' => $video->full_video_url, // Use the full URL accessor
                    'video_type' => $video->video_type,
                    'sort_order' => $video->sort_order,
                    'is_featured' => $video->is_featured,
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع الفيديو: ' . $e->getMessage()
            ], 500);
        }
    }
}
