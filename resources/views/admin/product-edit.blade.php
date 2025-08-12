@extends('layouts.admin')

@section('content')
    <!-- main-content-wrap -->
    <div class="main-content-inner">
        <!-- main-content-wrap -->
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Add Product</h3>
                <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li>
                        <a href="{{route('admin.index')}}"><div class="text-tiny">Dashboard</div></a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <a href="{{ route('admin.products') }}"><div class="text-tiny">Products</div></a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">Add product</div>
                    </li>
                </ul>
            </div>
            <!-- form-add-product -->
            <form class="tf-section-2 form-add-product" method="POST" enctype="multipart/form-data" action="{{route('admin.product.update')}}" >
                <input type="hidden" name="id" value="{{$product->id}}" />
                @csrf
                @method("PUT")
                <div class="wg-box">
                    <fieldset class="name">
                        <div class="body-title mb-10">Product name <span class="tf-color-1">*</span></div>
                        <input class="mb-10" type="text" placeholder="Enter product name" name="name" tabindex="0" value="{{$product->name}}" aria-required="true" required="">


                        <div class="text-tiny">Do not exceed 100 characters when entering the product name.</div>
                    </fieldset>

                    <fieldset class="name">
                        <div class="body-title mb-10">Slug <span class="tf-color-1">*</span></div>
                        <input class="mb-10" type="text" placeholder="Enter product slug" name="slug" tabindex="0" value="{{$product->slug}}" aria-required="true" required="">
                        <div class="text-tiny">Do not exceed 100 characters when entering the product name.</div>
                    </fieldset>

                    <div class="gap22 cols">
                        <fieldset class="category">
                            <div class="body-title mb-10">Category <span class="tf-color-1">*</span></div>
                            <div class="select">
                                <select class="" name="category_id">
                                    <option>Choose category</option>
                                    @foreach ($categories as $category)
                                    <option value="{{$category->id}}" {{$product->category_id == $category->id ? "selected":""}}>{{$category->name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </fieldset>
                        <fieldset class="brand">
                            <div class="body-title mb-10">Brand <span class="tf-color-1">*</span></div>
                            <div class="select">
                                <select class="" name="brand_id">
                                    <option>Choose Brand</option>
                                    @foreach ($brands as $brand)
                                    <option value="{{$brand->id}}" {{$product->brand_id == $brand->id ? "selected":""}}>{{$brand->name}}</option>
                                    @endforeach
                                </select>
                            </div>
                        </fieldset>
                    </div>

                    <fieldset class="shortdescription">
                        <div class="body-title mb-10">Short Description <span class="tf-color-1">*</span></div>
                        <textarea class="mb-10 ht-150" name="short_description" placeholder="Short Description" tabindex="0" aria-required="true" required="">{{$product->short_description}}</textarea>


                        <div class="text-tiny">Do not exceed 100 characters when entering the product name.</div>
                    </fieldset>

                    <fieldset class="description">
                        <div class="body-title mb-10">Description <span class="tf-color-1">*</span></div>
                        <textarea class="mb-10" name="description" placeholder="Description" tabindex="0" aria-required="true" required="">{{$product->description}}</textarea>
                        <div class="text-tiny">Do not exceed 100 characters when entering the product name.</div>
                    </fieldset>
                </div>
                <div class="wg-box">
                    <fieldset>
                        <div class="body-title">Upload images <span class="tf-color-1">*</span></div>
                        <div class="upload-image flex-grow">
                            @if($product->image)
                            <div class="item" id="imgpreview">
                                <img src="{{ asset('storage/uploads/' . $product->image) }}" class="effect8" alt="{{ $product->name }}">
                            </div>
                            @endif
                            <div id="upload-file" class="item up-load">
                                <label class="uploadfile" for="myFile">
                                    <span class="icon">
                                        <i class="icon-upload-cloud"></i>
                                    </span>
                                    <span class="body-text">Drop your images here or select <span class="tf-color">click to browse</span></span>
                                    <input type="file" id="myFile" name="image" accept="image/*">
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div class="body-title mb-10">Upload Gallery Images</div>
                        <div class="upload-image mb-16">
                            @if($product->images)
                                @foreach(explode(",", $product->images) as $img)
                                    <div class="item gitems">
                                        <img src="{{ asset('storage/uploads/' . trim($img)) }}" class="effect8" alt="{{ $product->name }} gallery image">
                                    </div>
                                @endforeach
                            @endif

                            <div  id ="galUpload" class="item up-load">
                                <label class="uploadfile" for="gFile">
                                    <span class="icon">
                                        <i class="icon-upload-cloud"></i>
                                    </span>
                                    <span class="text-tiny">Drop your images here or select <span class="tf-color">click to browse</span></span>
                                    <input type="file" id="gFile" name="images[]" accept="image/*" multiple>
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset class="name">
                        <div class="body-title mb-10">Product Type</div>
                        <div class="flex items-center gap-10">
                            <input type="checkbox" name="has_variants" id="has_variants" {{ $product->has_variants ? 'checked' : '' }}>
                            <label for="has_variants">This product has variants (e.g., sizes, colors)</label>
                        </div>
                    </fieldset>

                    <div id="simple-product-fields" style="{{ $product->has_variants ? 'display: none;' : '' }}">
                        <div class="cols gap22">
                            <fieldset class="name">
                                <div class="body-title mb-10">Regular Price <span class="tf-color-1">*</span></div>
                                <input class="mb-10" type="text" placeholder="Enter regular price" name="regular_price" tabindex="0" value="{{$product->regular_price}}">
                            </fieldset>
                            <fieldset class="name">
                                <div class="body-title mb-10">Quantity <span class="tf-color-1">*</span></div>
                                <input class="mb-10" type="text" placeholder="Enter quantity" name="quantity" tabindex="0" value="{{$product->quantity}}">
                            </fieldset>
                        </div>
                    </div>

                    <div id="variable-product-fields" style="{{ !$product->has_variants ? 'display: none;' : '' }}">
                        <div class="body-title mb-10">Product Variants</div>
                        <div id="variants-container">
                            @if($product->has_variants)
                                @foreach($product->variants as $index => $variant)
                                <div class="variant-row cols gap22 mb-10">
                                    <input type="text" name="variants[{{$index}}][size]" placeholder="Size" value="{{$variant->size}}" required>
                                    <input type="text" name="variants[{{$index}}][color]" placeholder="Color" value="{{$variant->color}}" required>
                                    <input type="number" name="variants[{{$index}}][price]" placeholder="Price" value="{{$variant->price}}" required>
                                    <input type="number" name="variants[{{$index}}][quantity]" placeholder="Quantity" value="{{$variant->quantity}}" required>
                                    <button type="button" class="tf-button remove-variant-btn">Remove</button>
                                </div>
                                @endforeach
                            @endif
                        </div>
                        <button type="button" id="add-variant-btn" class="tf-button mt-10">Add Variant</button>
                    </div>

                    <div class="cols gap22">
                        <fieldset class="name">
                            <div class="body-title mb-10">SKU <span class="tf-color-1">*</span></div>
                            <input class="mb-10" type="text" placeholder="Enter SKU" name="SKU" tabindex="0" value="{{$product->SKU}}" required>
                        </fieldset>
                        <fieldset class="name">
                            <div class="body-title mb-10">Sale Price</div>
                            <input class="mb-10" type="text" placeholder="Enter sale price" name="sale_price" tabindex="0" value="{{$product->sale_price}}">
                        </fieldset>
                    </div>

                    <div class="cols gap22">
                        <fieldset class="name">
                            <div class="body-title mb-10">Stock</div>
                            <div class="select mb-10">
                                <select class="" name="stock_status">
                                    <option value="instock" {{$product->stock_status == "instock" ? "Selected":"" }}>InStock</option>
                                    <option value="outofstock"  {{$product->stock_status == "outofstock" ? "Selected":"" }}>Out of Stock</option>
                                </select>
                            </div>
                        </fieldset>
                        <fieldset class="name">
                            <div class="body-title mb-10">Featured</div>
                            <div class="select mb-10">
                                <select class="" name="featured">
                                    <option value="0" {{$product->featured == "0" ? "Selected":"" }}>No</option>
                                    <option value="1" {{$product->featured == "1" ? "Selected":"" }}>Yes</option>
                                </select>
                            </div>
                        </fieldset>
                    </div>
                    <div class="cols gap10">
                        <button class="tf-button w-full" type="submit">Update product</button>
                    </div>
                </div>
            </form>
            <!-- /form-add-product -->
        </div>
        <!-- /main-content-wrap -->
    </div>
    <!-- /main-content-wrap -->
@endsection

@push("scripts")
<script>
    $(function() {
        // Toggle fields based on checkbox
        $('#has_variants').on('change', function() {
            if ($(this).is(':checked')) {
                $('#simple-product-fields').hide();
                $('#variable-product-fields').show();
            } else {
                $('#simple-product-fields').show();
                $('#variable-product-fields').hide();
            }
        });

        // Initialize variantIndex based on existing variants
        let variantIndex = {{ $product->variants->count() }};

        // Add new variant row
        $('#add-variant-btn').on('click', function() {
            const variantHtml = `
                <div class="variant-row cols gap22 mb-10">
                    <input type="text" name="variants[${variantIndex}][size]" placeholder="Size (e.g., M)" class="flex-grow" required>
                    <input type="text" name="variants[${variantIndex}][color]" placeholder="Color (e.g., Red)" class="flex-grow" required>
                    <input type="number" name="variants[${variantIndex}][price]" placeholder="Price" class="flex-grow" required>
                    <input type="number" name="variants[${variantIndex}][quantity]" placeholder="Quantity" class="flex-grow" required>
                    <button type="button" class="tf-button remove-variant-btn">Remove</button>
                </div>
            `;
            $('#variants-container').append(variantHtml);
            variantIndex++;
        });

        // Remove variant row
        $('#variants-container').on('click', '.remove-variant-btn', function() {
            $(this).closest('.variant-row').remove();
        });

        // Other existing scripts
        $("#myFile").on("change", function(e) {
            const [file] = this.files;
            if (file) {
                $("#imgpreview img").attr('src', URL.createObjectURL(file));
                $("#imgpreview").show();
            }
        });

        $("#gFile").on("change", function(e) {
            $(".gitems").remove();
            const gphotos = this.files;
            $.each(gphotos, function(key, val) {
                $("#galUpload").prepend(`<div class="item gitems"><img src="${URL.createObjectURL(val)}" alt=""></div>`);
            });
        });

        $("input[name='name']").on("change", function() {
            $("input[name='slug']").val(StringToSlug($(this).val()));
        });
    });

    function StringToSlug(Text) {
        return Text.toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    }
</script>
@endpush
