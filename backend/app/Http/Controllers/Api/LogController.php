<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class LogController extends Controller
{
    /**
     * عرض قائمة ملفات الـ logs
     */
    public function index()
    {
        try {
            $logPath = storage_path('logs');
            $logFiles = [];

            if (File::exists($logPath)) {
                $files = File::files($logPath);
                
                foreach ($files as $file) {
                    $fileName = $file->getFilename();
                    $filePath = $file->getPathname();
                    
                    $logFiles[] = [
                        'name' => $fileName,
                        'size' => $this->formatBytes($file->getSize()),
                        'modified' => date('Y-m-d H:i:s', $file->getMTime()),
                        'path' => $filePath
                    ];
                }
                
                // ترتيب حسب تاريخ التعديل (الأحدث أولاً)
                usort($logFiles, function($a, $b) {
                    return strtotime($b['modified']) - strtotime($a['modified']);
                });
            }

            return response()->json([
                'success' => true,
                'logs' => $logFiles,
                'total' => count($logFiles)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب ملفات الـ logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض محتوى ملف log محدد
     */
    public function show(Request $request, $filename)
    {
        try {
            $logPath = storage_path('logs/' . $filename);
            
            if (!File::exists($logPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'ملف الـ log غير موجود'
                ], 404);
            }

            $lines = (int) $request->get('lines', 100); // عدد الأسطر المطلوبة
            $content = $this->getLastLines($logPath, $lines);

            return response()->json([
                'success' => true,
                'filename' => $filename,
                'content' => $content,
                'lines_shown' => $lines,
                'file_size' => $this->formatBytes(File::size($logPath)),
                'last_modified' => date('Y-m-d H:i:s', File::lastModified($logPath))
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في قراءة ملف الـ log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * البحث في logs
     */
    public function search(Request $request)
    {
        try {
            $query = $request->get('query');
            $filename = $request->get('filename', 'laravel.log');
            $logPath = storage_path('logs/' . $filename);

            if (!File::exists($logPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'ملف الـ log غير موجود'
                ], 404);
            }

            $results = [];
            $lineNumber = 0;
            
            $handle = fopen($logPath, 'r');
            if ($handle) {
                while (($line = fgets($handle)) !== false) {
                    $lineNumber++;
                    if (stripos($line, $query) !== false) {
                        $results[] = [
                            'line_number' => $lineNumber,
                            'content' => trim($line),
                            'timestamp' => $this->extractTimestamp($line)
                        ];
                    }
                }
                fclose($handle);
            }

            return response()->json([
                'success' => true,
                'query' => $query,
                'filename' => $filename,
                'results' => array_slice($results, -50), // آخر 50 نتيجة
                'total_matches' => count($results)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البحث',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف ملف log
     */
    public function destroy($filename)
    {
        try {
            $logPath = storage_path('logs/' . $filename);
            
            if (!File::exists($logPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'ملف الـ log غير موجود'
                ], 404);
            }

            File::delete($logPath);

            return response()->json([
                'success' => true,
                'message' => 'تم حذف ملف الـ log بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في حذف ملف الـ log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تنظيف جميع ملفات logs القديمة
     */
    public function cleanup(Request $request)
    {
        try {
            $days = (int) $request->get('days', 7); // حذف الملفات الأقدم من 7 أيام
            $logPath = storage_path('logs');
            $deletedFiles = [];

            if (File::exists($logPath)) {
                $files = File::files($logPath);
                $cutoffTime = time() - ($days * 24 * 60 * 60);

                foreach ($files as $file) {
                    if ($file->getMTime() < $cutoffTime) {
                        $deletedFiles[] = $file->getFilename();
                        File::delete($file->getPathname());
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تنظيف ملفات الـ logs بنجاح',
                'deleted_files' => $deletedFiles,
                'deleted_count' => count($deletedFiles)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تنظيف ملفات الـ logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب آخر الأخطاء
     */
    public function errors(Request $request)
    {
        try {
            $filename = $request->get('filename', 'laravel.log');
            $logPath = storage_path('logs/' . $filename);

            if (!File::exists($logPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'ملف الـ log غير موجود'
                ], 404);
            }

            $errors = [];
            $handle = fopen($logPath, 'r');
            
            if ($handle) {
                while (($line = fgets($handle)) !== false) {
                    if (stripos($line, 'ERROR') !== false || stripos($line, 'CRITICAL') !== false) {
                        $errors[] = [
                            'content' => trim($line),
                            'timestamp' => $this->extractTimestamp($line),
                            'level' => $this->extractLogLevel($line)
                        ];
                    }
                }
                fclose($handle);
            }

            // آخر 20 خطأ
            $errors = array_slice($errors, -20);

            return response()->json([
                'success' => true,
                'filename' => $filename,
                'errors' => $errors,
                'total_errors' => count($errors)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في جلب الأخطاء',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب آخر الأسطر من ملف
     */
    private function getLastLines($filename, $lines = 100)
    {
        $handle = fopen($filename, 'r');
        $linecounter = $lines;
        $pos = -2;
        $beginning = false;
        $text = [];

        while ($linecounter > 0) {
            $t = " ";
            while ($t != "\n") {
                if (fseek($handle, $pos, SEEK_END) == -1) {
                    $beginning = true;
                    break;
                }
                $t = fgetc($handle);
                $pos--;
            }
            $linecounter--;
            if ($beginning) {
                rewind($handle);
            }
            $text[$lines - $linecounter - 1] = fgets($handle);
            if ($beginning) break;
        }
        fclose($handle);
        
        return implode("", array_reverse($text));
    }

    /**
     * تنسيق حجم الملف
     */
    private function formatBytes($size, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, $precision) . ' ' . $units[$i];
    }

    /**
     * استخراج الوقت من سطر log
     */
    private function extractTimestamp($line)
    {
        if (preg_match('/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $line, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * استخراج مستوى الـ log
     */
    private function extractLogLevel($line)
    {
        if (preg_match('/\.(ERROR|CRITICAL|WARNING|INFO|DEBUG):/', $line, $matches)) {
            return $matches[1];
        }
        return 'UNKNOWN';
    }
}