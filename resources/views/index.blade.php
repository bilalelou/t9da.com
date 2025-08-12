@extends('layouts.app')

@section('content')
<style>
    /* General Style Improvements */
    body {
        background-color: #ffffff; /* Clean white background */
        color: #212529;
    }
    .section-padding {
        padding: 80px 0;
    }
    .section-title {
        font-weight: 800; /* Bolder title */
        font-size: 2.5rem;
        position: relative;
        padding-bottom: 20px;
        margin-bottom: 60px;
    }
    .section-title:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background-color: #000;
        border-radius: 2px;
    }

    /* Features Section */
    .feature-item {
        text-align: center;
        padding: 20px;
        transition: transform 0.3s ease;
    }
    .feature-item:hover {
        transform: translateY(-5px);
    }
    .feature-item .icon {
        font-size: 3rem;
        margin-bottom: 20px;
        color: #000;
    }

    /* ======================================================= */
    /* تم تعديل تصميم قسم الفئات ليصبح دائرياً */
    /* ======================================================= */
    .category-item-circle {
        text-align: center;
        text-decoration: none;
        color: #333;
        display: block;
    }
    .category-item-circle .image-wrapper {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto 15px;
        border: 3px solid #f0f0f0;
        transition: border-color 0.3s ease, transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    .category-item-circle:hover .image-wrapper {
        border-color: #000;
        transform: translateY(-5px) scale(1.05);
    }
    .category-item-circle img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .category-item-circle .category-title {
        font-weight: 600;
        transition: color 0.3s ease;
    }
    .category-item-circle:hover .category-title {
        color: #000;
    }

    /* Premium Product Card */
    .product-card {
        background-color: #fff;
        border: 1px solid #e9e9e9;
        border-radius: 15px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    .product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }
    .pc__img-wrapper {
        position: relative;
    }
    .pc__img-second {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity 0.4s ease;
    }
    .product-card:hover .pc__img-second {
        opacity: 1;
    }
    .pc__info { padding: 20px; text-align: center; }
    .pc__title a { color: #212529; font-weight: 600; text-decoration: none; }
    .product-card__price .price-old { color: #999; text-decoration: line-through; margin-left: 8px; }
    .product-card__price .price-sale { color: #d9534f; font-weight: bold; }
    .product-card-actions {
        position: absolute;
        bottom: -60px; /* Start off-screen */
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        transition: bottom 0.3s ease;
        width: 100%;
        justify-content: center;
        padding: 10px;
    }
    .product-card:hover .product-card-actions {
        bottom: 10px; /* Slide in on hover */
    }
    .product-card-actions .btn-action {
        width: 45px; height: 45px; border-radius: 50%; background-color: #fff;
        border: 1px solid #eee; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: #333; cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .product-card-actions .btn-action:hover { background-color: #000; color: #fff; }

    /* Testimonials */
    .testimonial-card {
        background: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        text-align: center;
    }
    .testimonial-card img {
        width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px;
    }

    /* Newsletter & Brands */
    .newsletter-section, .brands-section {
        background-color: #e9ecef;
    }
    /* ======================================================= */
    /* تم إضافة هذا الجزء لجعل الماركات دائرية */
    /* ======================================================= */
    .brand-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        margin: 0 auto;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .brand-circle:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .brand-logo {
        max-width: 100%;
        max-height: 100%;
        filter: grayscale(100%);
        opacity: 0.6;
        transition: filter 0.3s ease, opacity 0.3s ease;
    }
    .brand-circle:hover .brand-logo {
        filter: grayscale(0%);
        opacity: 1;
    }

    /* Scroll Animation */
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .reveal-on-scroll.is-visible {
        opacity: 1;
        transform: translateY(0);
    }

    @media (max-width: 767px) {
        .section-padding {
            padding: 40px 0;
        }
        .section-title {
            font-size: 1.8rem;
            margin-bottom: 40px;
        }
        .slideshow-text h2 {
            font-size: 2rem;
        }
        .category-item-circle .image-wrapper {
            width: 100px;
            height: 100px;
        }
        .brand-circle {
            width: 100px;
            height: 100px;
        }
    }
</style>

<main>
    {{-- 1. Hero Slider Section --}}
    <section class="swiper-container js-swiper-slider swiper-number-pagination slideshow"
        data-settings='{"autoplay": {"delay": 5000}, "slidesPerView": 1, "effect": "fade", "loop": true}'>
        <div class="swiper-wrapper">
            @foreach ($slides as $slide)
                <div class="swiper-slide">
                    <div class="overflow-hidden position-relative h-100">
                        <div class="slideshow-character position-absolute bottom-0 pos_right-center">
                            <img loading="lazy" src="{{ asset('storage/uploads/' . $slide->image) }}" width="542"
                                height="733" alt="{{ $slide->title }}"
                                class="slideshow-character_img animate animate_fade animate_btt animate_delay-9 w-auto h-auto" />
                        </div>
                        <div class="slideshow-text container position-absolute start-50 top-50 translate-middle">
                            <h6 class="text_dash text-uppercase fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                                {{ $slide->tagline }}
                            </h6>
                            <h2 class="h1 fw-normal mb-0 animate animate_fade animate_btt animate_delay-5">
                                {{ $slide->title }}</h2>
                            <h2 class="h1 fw-bold animate animate_fade animate_btt animate_delay-5">
                                {{ $slide->subtitle }}</h2>
                            <a href="{{ $slide->link }}"
                                class="btn btn-dark btn-lg mt-3 animate animate_fade animate_btt animate_delay-7">
                                Shop Now
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        <div class="container">
            <div class="slideshow-pagination slideshow-number-pagination d-flex align-items-center position-absolute bottom-0 mb-5"></div>
        </div>
    </section>

    {{-- 2. Features Section --}}
    <section class="container section-padding">
        <div class="row">
            <div class="col-md-3">
                <div class="feature-item">
                    <div class="icon"><i class="icon-shipping"></i></div>
                    <h5>Free Shipping</h5>
                    <p class="text-muted">On all orders over $99</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="feature-item">
                    <div class="icon"><i class="icon-headphone"></i></div>
                    <h5>24/7 Support</h5>
                    <p class="text-muted">Get help when you need it</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="feature-item">
                    <div class="icon"><i class="icon-shield"></i></div>
                    <h5>Secure Payments</h5>
                    <p class="text-muted">100% secure payment</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="feature-item">
                    <div class="icon"><i class="icon-gift"></i></div>
                    <h5>Easy Returns</h5>
                    <p class="text-muted">30-day money back guarantee</p>
                </div>
            </div>
        </div>
    </section>

    {{-- 3. Categories Section --}}
    <section class="category-carousel container section-padding reveal-on-scroll">
        <h2 class="section-title text-center">Shop By Category</h2>
        <div class="row">
            @foreach ($categories->take(6) as $category)
                <div class="col-6 col-md-4 col-lg-2 mb-4">
                    <a href="{{ route('shop.index', ['categories' => $category->id]) }}" class="category-item-circle">
                        <div class="image-wrapper">
                            <img loading="lazy" src="{{ asset('storage/uploads/categories/' . $category->image) }}" alt="{{ $category->name }}" />
                        </div>
                        <h5 class="category-title">{{ $category->name }}</h5>
                    </a>
                </div>
            @endforeach
        </div>
    </section>

    {{-- 4. Featured Products Section --}}
    <section class="products-grid container section-padding reveal-on-scroll">
        <h2 class="section-title text-center">Featured Products</h2>
        <div class="row">
            @foreach ($fproducts as $fproduct)
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="product-card">
                        <div class="pc__img-wrapper">
                            <a href="{{ route('shop.product.details', ['product_slug' => $fproduct->slug]) }}">
                                <img loading="lazy" src="{{ asset('storage/uploads/' . $fproduct->image) }}" width="330" height="400" alt="{{ $fproduct->name }}" class="pc__img" />
                            </a>
                            <div class="product-card-actions">
                                 <form method="POST" action="{{ route('wishlist.add') }}" class="d-inline">@csrf<input type="hidden" name="id" value="{{ $fproduct->id }}"><input type="hidden" name="name" value="{{ $fproduct->name }}"><input type="hidden" name="price" value="{{ $fproduct->sale_price ?? $fproduct->regular_price }}"><button type="submit" class="btn-action" title="Add to Wishlist"><i class="icon-heart"></i></button></form>
                                <form method="POST" action="{{ route('cart.add') }}" class="d-inline">@csrf<input type="hidden" name="id" value="{{ $fproduct->id }}"><input type="hidden" name="name" value="{{ $fproduct->name }}"><input type="hidden" name="price" value="{{ $fproduct->sale_price ?? $fproduct->regular_price }}"><input type="hidden" name="quantity" value="1"><button type="submit" class="btn-action" title="Add to Cart"><i class="icon-shopping-cart"></i></button></form>
                            </div>
                        </div>
                        <div class="pc__info position-relative">
                            <h6 class="pc__title"><a href="{{ route('shop.product.details', ['product_slug' => $fproduct->slug]) }}">{{ $fproduct->name }}</a></h6>
                            <div class="product-card__price d-flex justify-content-center">
                                @if ($fproduct->sale_price)
                                    <span class="money price-sale">${{ $fproduct->sale_price }}</span>
                                    <span class="money price-old">${{ $fproduct->regular_price }}</span>
                                @else
                                    <span class="money price text-secondary">${{ $fproduct->regular_price }}</span>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    {{-- 5. New Arrivals Section --}}
    <section class="hot-deals container section-padding reveal-on-scroll">
        <h2 class="section-title text-center">New Arrivals</h2>
        <div class="row">
            @foreach ($sproducts as $product)
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="product-card">
                        <div class="pc__img-wrapper">
                            <a href="{{ route('shop.product.details', ['product_slug' => $product->slug]) }}">
                                <img loading="lazy" src="{{ asset('storage/uploads/' . $product->image) }}"
                                    width="330" height="400" alt="{{ $product->name }}" class="pc__img" />
                            </a>
                            <div class="product-card-actions">
                                <form method="POST" action="{{ route('wishlist.add') }}" class="d-inline">@csrf<input type="hidden" name="id" value="{{ $product->id }}"><input type="hidden" name="name" value="{{ $product->name }}"><input type="hidden" name="price" value="{{ $product->sale_price ?? $product->regular_price }}"><button type="submit" class="btn-action" title="Add to Wishlist"><i class="icon-heart"></i></button></form>
                                <form method="POST" action="{{ route('cart.add') }}" class="d-inline">@csrf<input type="hidden" name="id" value="{{ $product->id }}"><input type="hidden" name="name" value="{{ $product->name }}"><input type="hidden" name="price" value="{{ $product->sale_price ?? $product->regular_price }}"><input type="hidden" name="quantity" value="1"><button type="submit" class="btn-action" title="Add to Cart"><i class="icon-shopping-cart"></i></button></form>
                            </div>
                        </div>
                        <div class="pc__info position-relative">
                            <h6 class="pc__title"><a href="{{ route('shop.product.details', ['product_slug' => $product->slug]) }}">{{ $product->name }}</a></h6>
                            <div class="product-card__price d-flex justify-content-center">
                                @if ($product->sale_price)
                                    <span class="money price-sale">${{ $product->sale_price }}</span>
                                    <span class="money price-old">${{ $product->regular_price }}</span>
                                @else
                                    <span class="money price text-secondary">${{ $product->regular_price }}</span>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    {{-- 6. Testimonials Section --}}
    <section class="container section-padding reveal-on-scroll">
        <h2 class="section-title text-center">What Our Customers Say</h2>
        <div class="row">
            <div class="col-md-4">
                <div class="testimonial-card">
                    <img src="https://placehold.co/80x80" alt="Customer">
                    <p class="fst-italic">"Amazing quality and fast shipping! I'm very happy with my purchase and will definitely shop here again."</p>
                    <h6 class="mt-3 mb-0">Fatima Zahra</h6>
                    <small class="text-muted">Casablanca</small>
                </div>
            </div>
            <div class="col-md-4">
                <div class="testimonial-card">
                    <img src="https://placehold.co/80x80" alt="Customer">
                    <p class="fst-italic">"The customer service was excellent. They helped me choose the perfect size. Highly recommended!"</p>
                    <h6 class="mt-3 mb-0">Youssef Ahmed</h6>
                    <small class="text-muted">Rabat</small>
                </div>
            </div>
            <div class="col-md-4">
                <div class="testimonial-card">
                    <img src="https://placehold.co/80x80" alt="Customer">
                    <p class="fst-italic">"I love the variety of products available. It's my new favorite online store for everything I need."</p>
                    <h6 class="mt-3 mb-0">Amina Khalid</h6>
                    <small class="text-muted">Marrakech</small>
                </div>
            </div>
        </div>
    </section>

    {{-- 7. Brands Section --}}
    <section class="brands-section section-padding reveal-on-scroll">
        <div class="container">
            <h2 class="section-title text-center">Our Brands</h2>
            <div class="row align-items-center">
                @foreach($brands->take(6) as $brand)
                <div class="col-6 col-md-2 text-center mb-4">
                    <div class="brand-circle">
                        <img src="{{ asset('storage/uploads/brands/' . $brand->image) }}" alt="{{ $brand->name }}" class="img-fluid brand-logo">
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    {{-- 8. Newsletter Section --}}
    <section class="newsletter-section section-padding reveal-on-scroll">
        <div class="container text-center">
            <h2 class="section-title">Join Our Newsletter</h2>
            <p class="lead">Sign up now to receive exclusive offers and the latest news.</p>
            <form class="d-flex justify-content-center mt-4">
                <input type="email" class="form-control w-100 w-md-50 me-2" placeholder="Enter your email address">
                <button type="submit" class="btn btn-dark">Subscribe</button>
            </form>
        </div>
    </section>
</main>
@endsection

@push('scripts')
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
        elementsToReveal.forEach(el => {
            observer.observe(el);
        });
    });
</script>
@endpush
