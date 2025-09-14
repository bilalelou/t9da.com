@extends('layouts.admin')

{{-- إضافة أنماط مخصصة لتحسين الواجهة --}}
@push('styles')
<style>
    /* تعريف متغيرات الألوان الرئيسية لتسهيل التعديل */
    :root {
        --brand-color: #4f46e5; /* Indigo-600 */
        --brand-color-hover: #4338ca; /* Indigo-700 */
        --body-bg: #f9fafb; /* Gray-50 */
        --card-bg: #ffffff;
        --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --input-border: #d1d5db; /* Gray-300 */
    }

    body {
        background-color: var(--body-bg);
    }

    /* نمط موحد لحقول الإدخال */
    .form-input {
        @apply block w-full rounded-lg border-[var(--input-border)] shadow-sm focus:border-[var(--brand-color)] focus:ring focus:ring-[var(--brand-color)] focus:ring-opacity-50 sm:text-sm transition-colors duration-200;
    }

    /* نمط محسن لحقول الاختيار Select */
    .form-select {
        @apply block w-full rounded-lg border-[var(--input-border)] shadow-sm focus:border-[var(--brand-color)] focus:ring focus:ring-[var(--brand-color)] focus:ring-opacity-50 sm:text-sm transition-colors duration-200;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    /* نمط موحد للأزرار الرئيسية */
    .btn-primary {
        @apply inline-flex justify-center items-center rounded-lg border border-transparent bg-[var(--brand-color)] py-2.5 px-5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--brand-color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 transition-all;
    }

    .btn-secondary {
        @apply inline-flex justify-center items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 transition-all;
    }

    /* تصميم بطاقات المحتوى */
    .content-card {
        background-color: var(--card-bg);
        border-radius: 0.75rem; /* 12px */
        box-shadow: var(--card-shadow);
        padding: 1.5rem; /* 24px */
    }
</style>
@endpush


@section('content')
    <div class="main-content-inner">
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap-4 mb-8">
                <h3 class="text-2xl font-bold text-gray-800">Add New Product</h3>
                {{-- تحسين تصميم مسار التنقل --}}
                <ul class="breadcrumbs flex items-center flex-wrap justify-start text-sm text-gray-500">
                    <li><a href="#" class="hover:text-[var(--brand-color)]">Dashboard</a></li>
                    <li class="mx-2"><i class="icon-chevron-right"></i></li>
                    <li><a href="#" class="hover:text-[var(--brand-color)]">Products</a></li>
                    <li class="mx-2"><i class="icon-chevron-right"></i></li>
                    <li class="text-gray-800 font-medium">Add Product</li>
                </ul>
            </div>

            <form method="POST" enctype="multipart/form-data" action="{{route('admin.product.store')}}" class="space-y-8">
                @csrf
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- العمود الأيسر: معلومات المنتج الرئيسية -->
                    <div class="lg:col-span-2 space-y-6">
                        <div class="content-card">
                            <h4 class="text-lg font-semibold text-gray-900 mb-5">Product Information</h4>
                            <div class="space-y-4">
                                <div>
                                    <label for="name" class="block text-sm font-medium text-gray-700">Product name <span class="text-red-500">*</span></label>
                                    <input type="text" id="name" name="name" class="form-input mt-1" placeholder="e.g., Classic Cotton T-Shirt" value="{{ old('name') }}" required>
                                    @error("name") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                                <div>
                                    <label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
                                    <input type="text" id="slug" name="slug" class="form-input mt-1 bg-gray-100 cursor-not-allowed" placeholder="Automatically generated" value="{{ old('slug') }}" readonly>
                                </div>
                                <div>
                                    <label for="short_description" class="block text-sm font-medium text-gray-700">Short Description <span class="text-red-500">*</span></label>
                                    <textarea id="short_description" name="short_description" rows="3" class="form-input mt-1" required>{{ old('short_description') }}</textarea>
                                    @error("short_description") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                                <div>
                                    <label for="description" class="block text-sm font-medium text-gray-700">Full Description <span class="text-red-500">*</span></label>
                                    <textarea id="description" name="description" rows="6" class="form-input mt-1" required>{{ old('description') }}</textarea>
                                    @error("description") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="content-card">
                            <h4 class="text-lg font-semibold text-gray-900 mb-5">Product Images</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Main Image <span class="text-red-500">*</span></label>
                                    <input type="file" id="myFile" name="image" class="form-input" accept="image/*">
                                    <div class="mt-2" id="imgpreview" style="display:none;"><img src="#" class="max-h-40 rounded-lg" alt="Main image preview"/></div>
                                    @error("image") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Image Gallery</label>
                                    <input type="file" id="gFile" name="images[]" class="form-input" accept="image/*" multiple>
                                    <div id="galUpload" class="mt-2 grid grid-cols-3 gap-2"></div>
                                    @error("images") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                            </div>
                        </div>

                        <!-- قسم البيانات المحسن -->
                        <div class="content-card">
                            <h4 class="text-lg font-semibold text-gray-900 mb-5">Product Data</h4>
                            <div class="flex items-center gap-4">
                                <input type="checkbox" name="has_variants" id="has_variants" value="1" class="h-4 w-4 rounded border-gray-300 text-[var(--brand-color)] focus:ring-[var(--brand-color)]" {{ old('has_variants') ? 'checked' : '' }}>
                                <label for="has_variants" class="font-medium text-gray-700">This product has multiple options (variants)</label>
                            </div>

                            <!-- حقول المنتج المتعدد -->
                            <div id="variable-product-fields" class="hidden mt-6">
                                <div id="variants-header" class="hidden md:grid grid-cols-12 gap-4 items-center px-3 mb-2">
                                    <div class="md:col-span-3"><label class="text-xs font-bold text-gray-500 uppercase">Size</label></div>
                                    <div class="md:col-span-3"><label class="text-xs font-bold text-gray-500 uppercase">Color</label></div>
                                    <div class="md:col-span-2"><label class="text-xs font-bold text-gray-500 uppercase">Price</label></div>
                                    <div class="md:col-span-2"><label class="text-xs font-bold text-gray-500 uppercase">Quantity</label></div>
                                </div>
                                <div id="variants-container" class="space-y-2"></div>
                                <button type="button" id="add-variant-btn" class="btn-secondary mt-4 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    Add Variant
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- العمود الأيمن: التنظيم والأسعار -->
                    <div class="lg:col-span-1 space-y-6">
                        <div class="content-card">
                             <h4 class="text-lg font-semibold text-gray-900 mb-5">Organization</h4>
                             <div class="space-y-4">
                                <div>
                                    <label for="category_id" class="block text-sm font-medium text-gray-700">Category <span class="text-red-500">*</span></label>
                                    <select id="category_id" name="category_id" class="form-select mt-1" required>
                                        <option value="">Choose category</option>
                                        @foreach ($categories as $category)
                                        <option value="{{$category->id}}" {{ old('category_id') == $category->id ? 'selected' : '' }}>{{$category->name}}</option>
                                        @endforeach
                                    </select>
                                    @error("category_id") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                                <div>
                                    <label for="brand_id" class="block text-sm font-medium text-gray-700">Brand <span class="text-red-500">*</span></label>
                                    <select id="brand_id" name="brand_id" class="form-select mt-1" required>
                                        <option value="">Choose Brand</option>
                                        @foreach ($brands as $brand)
                                        <option value="{{$brand->id}}" {{ old('brand_id') == $brand->id ? 'selected' : '' }}>{{$brand->name}}</option>
                                        @endforeach
                                    </select>
                                    @error("brand_id") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                             </div>
                        </div>
                        <div class="content-card">
                            <h4 class="text-lg font-semibold text-gray-900 mb-5">Pricing & Stock</h4>
                            <div class="space-y-4">
                                <!-- حقول المنتج البسيط تم نقلها هنا -->
                                <div id="simple-product-fields" class="space-y-4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="regular_price" class="block text-sm font-medium text-gray-700">Regular Price <span class="text-red-500">*</span></label>
                                            <input type="number" id="regular_price" name="regular_price" class="form-input mt-1" value="{{ old('regular_price') }}" step="0.01">
                                        </div>
                                        <div>
                                            <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity <span class="text-red-500">*</span></label>
                                            <input type="number" id="quantity" name="quantity" class="form-input mt-1" value="{{ old('quantity') }}">
                                        </div>
                                    </div>
                                </div>
                                <hr id="pricing-separator" class="border-gray-200">
                                <div>
                                    <label for="SKU" class="block text-sm font-medium text-gray-700">SKU <span class="text-red-500">*</span></label>
                                    <input type="text" id="SKU" name="SKU" class="form-input mt-1" value="{{ old('SKU') }}" required>
                                    @error("SKU") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                                <div>
                                    <label for="sale_price" class="block text-sm font-medium text-gray-700">Sale Price</label>
                                    <input type="number" id="sale_price" name="sale_price" class="form-input mt-1" value="{{ old('sale_price') }}" step="0.01">
                                    @error("sale_price") <p class="mt-1 text-sm text-red-600">{{$message}}</p> @enderror
                                </div>
                                <div>
                                    <label for="stock_status" class="block text-sm font-medium text-gray-700">Stock Status</label>
                                    <select id="stock_status" name="stock_status" class="form-select mt-1">
                                        <option value="instock" {{ old('stock_status') == 'instock' ? 'selected' : '' }}>In Stock</option>
                                        <option value="outofstock" {{ old('stock_status') == 'outofstock' ? 'selected' : '' }}>Out of Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="featured" class="block text-sm font-medium text-gray-700">Featured Product</label>
                                    <select id="featured" name="featured" class="form-select mt-1">
                                        <option value="0" {{ old('featured') == '0' ? 'selected' : '' }}>No</option>
                                        <option value="1" {{ old('featured') == '1' ? 'selected' : '' }}>Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button class="btn-primary w-full lg:w-auto" type="submit">Publish Product</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection

@push("scripts")
<script>
$(function() {
    function StringToSlug(text) {
        return text.toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }

    $('input[name="name"]').on("keyup change", function() {
        $('input[name="slug"]').val(StringToSlug($(this).val()));
    });

    let variantIndex = 0;

    function toggleProductFields() {
        const hasVariants = $('#has_variants').is(':checked');
        const variantsExist = $('#variants-container').children().length > 0;

        $('#simple-product-fields').toggle(!hasVariants);
        $('#variable-product-fields').toggle(hasVariants);

        // إظهار وإخفاء الخط الفاصل
        $('#pricing-separator').toggle(!hasVariants);

        $('#simple-product-fields').find('input').prop('required', !hasVariants);
        $('#variants-container input').prop('required', hasVariants && variantsExist);

        $('#variants-header').toggle(hasVariants && variantsExist);
    }

    $('#has_variants').on('change', toggleProductFields);

    $('#add-variant-btn').on('click', function() {
        const variantHtml = `
            <div class="variant-row grid grid-cols-12 gap-x-4 gap-y-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                <div class="col-span-12 md:col-span-3">
                    <input type="text" name="variants[${variantIndex}][size]" placeholder="Size" class="form-input text-sm" required>
                </div>
                <div class="col-span-12 md:col-span-3">
                    <input type="text" name="variants[${variantIndex}][color]" placeholder="Color" class="form-input text-sm" required>
                </div>
                <div class="col-span-6 md:col-span-2">
                    <input type="number" name="variants[${variantIndex}][price]" placeholder="Price" class="form-input text-sm" step="0.01" required>
                </div>
                <div class="col-span-6 md:col-span-2">
                    <input type="number" name="variants[${variantIndex}][quantity]" placeholder="Qty" class="form-input text-sm" required>
                </div>
                <div class="col-span-12 md:col-span-2 flex justify-end">
                    <button type="button" class="remove-variant-btn text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        `;
        $('#variants-container').append(variantHtml);
        variantIndex++;
        toggleProductFields();
    });

    $('#variants-container').on('click', '.remove-variant-btn', function() {
        $(this).closest('.variant-row').remove();
        toggleProductFields();
    });

    // تشغيل الدالة عند تحميل الصفحة لضمان الحالة الأولية الصحيحة
    toggleProductFields();

    $("#myFile").on("change", function(e) {
        const [file] = this.files;
        if (file) {
            $("#imgpreview img").attr('src', URL.createObjectURL(file));
            $("#imgpreview").show();
        }
    });

    $("#gFile").on("change", function(e) {
        $("#galUpload").empty();
        const files = this.files;
        if (files && files.length > 0) {
            $.each(files, function(i, file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imgHtml = `<div class="relative"><img src="${event.target.result}" class="h-24 w-full object-cover rounded-md"></div>`;
                    $("#galUpload").append(imgHtml);
                };
                reader.readAsDataURL(file);
            });
        }
    });
});
</script>
@endpush
