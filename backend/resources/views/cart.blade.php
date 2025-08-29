@extends('layouts.app');
@section('content')

    <main class="pt-90">
        <div class="mb-4 pb-4"></div>
        <section class="shop-checkout container">
            <h2 class="page-title">Cart</h2>
            <div class="checkout-steps">
                <a href="{{ route('cart.index') }}" class="checkout-steps__item active">
                    <span class="checkout-steps__item-number">01</span>
                    <span class="checkout-steps__item-title">
                        <span>Shopping Bag</span>
                        <em>Manage Your Items List</em>
                    </span>
                </a>
                <a href="{{route('cart.checkout')}}" class="checkout-steps__item">
                    <span class="checkout-steps__item-number">02</span>
                    <span class="checkout-steps__item-title">
                        <span>Shipping and Checkout</span>
                        <em>Checkout Your Items List</em>
                    </span>
                </a>
                <a href="#" class="checkout-steps__item">
                    <span class="checkout-steps__item-number">03</span>
                    <span class="checkout-steps__item-title">
                        <span>Confirmation</span>
                        <em>Review And Submit Your Order</em>
                    </span>
                </a>
            </div>
            <div class="shopping-cart">
                @if (Cart::instance('cart')->count() > 0)
                    <div class="cart-table__wrapper">
                        <table class="cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th></th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach (Cart::instance('cart')->content() as $cartItem)
                                    <tr>
                                        <td>
                                            <div class="shopping-cart__product-item">
                                                <a href="{{ route('shop.product.details', ['product_slug' => $cartItem->model->slug]) }}">
                                                    <img loading="lazy"
                                                        src="{{ asset('storage/uploads/' . $cartItem->model->image) }}"
                                                        width="120" height="120" alt="{{ $cartItem->name }}" />
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="shopping-cart__product-item__detail">
                                                <h4><a href="{{ route('shop.product.details', ['product_slug' => $cartItem->model->slug]) }}">{{ $cartItem->name }}</a></h4>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="shopping-cart__product-price">MAD{{ $cartItem->price }}</span>
                                        </td>
                                        <td>
                                            <div class="qty-control position-relative">
                                                <input type="number" name="quantity" value="{{ $cartItem->qty }}" min="1" class="qty-control__number text-center">
                                                <form method="POST" action="{{ route('cart.reduce.qty', ['rowId' => $cartItem->rowId]) }}">
                                                    @csrf
                                                    @method('PUT')
                                                    <div class="qty-control__reduce">-</div>
                                                </form>
                                                <form method="POST" action="{{ route('cart.increase.qty', ['rowId' => $cartItem->rowId]) }}">
                                                    @csrf
                                                    @method('PUT')
                                                    <div class="qty-control__increase">+</div>
                                                </form>
                                            </div>
                                        </td>
                                        <td>
                                            {{-- ======================================================= --}}
                                            {{-- تم إصلاح هذا السطر باستدعاء subtotal كدالة --}}
                                            {{-- ======================================================= --}}
                                            <span class="shopping-cart__subtotal">MAD{{ $cartItem->subtotal() }}</span>
                                        </td>
                                        <td>
                                            <form method="POST" action="{{ route('cart.remove', ['rowId' => $cartItem->rowId]) }}">
                                                @csrf
                                                @method('DELETE')
                                                <a href="#" class="remove-cart">
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="#767676" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
                                                        <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
                                                    </svg>
                                                </a>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>

                    <div class="cart-table-footer mt-3">
                        <div class="d-flex align-items-center">
                            @if (!Session::has('coupon'))
                                <form class="d-flex" method="POST" action="{{ route('cart.coupon.apply') }}">
                                    @csrf
                                    <input class="form-control" type="text" name="coupon_code" placeholder="Coupon Code" required>
                                    <button type="submit" class="btn btn-outline-secondary text-nowrap ms-2">APPLY COUPON</button>
                                </form>
                            @endif
                            <form method="POST" action="{{ route('cart.empty') }}" class="ms-3">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-light" type="submit">CLEAR CART</button>
                            </form>
                        </div>
                    </div>
                        <div>
                            @if (Session::has('success'))
                                <div class="alert alert-success mt-3">{{ Session::get('success') }}</div>
                            @elseif(Session::has('error'))
                                <div class="alert alert-danger mt-3">{{ Session::get('error') }}</div>
                            @endif
                        </div>
                    </div>

                    <div class="shopping-cart__totals-wrapper">
                        <div class="sticky-content">
                            <div class="shopping-cart__totals">
                                <h3>Cart Totals</h3>
                                <table class="cart-totals">
                                    <tbody>
                                        <tr>
                                            <th>Subtotal</th>
                                            <td>MAD{{ Cart::instance('cart')->subtotal() }}</td>
                                        </tr>

                                        @if (Session::has('checkout'))
                                            <tr>
                                                <th>
                                                    Discount ({{ Session::get('coupon')['code'] }})
                                                    <form action="{{ route('cart.coupon.remove') }}" method="POST" style="display: inline;">
                                                        @csrf
                                                        @method('DELETE')
                                                        <button type="submit" style="background:none; border:none; color:red; cursor:pointer; font-size:12px;">[Remove]</button>
                                                    </form>
                                                </th>
                                                <td>-MAD{{ Session::get('checkout')['discount'] }}</td>
                                            </tr>
                                            <tr>
                                                <th>Tax</th>
                                                <td>MAD{{ Session::get('checkout')['tax'] }}</td>
                                            </tr>
                                            <tr>
                                                <th>Total</th>
                                                <td><strong>MAD{{ Session::get('checkout')['total'] }}</strong></td>
                                            </tr>
                                        @else
                                            <tr>
                                                <th>Tax</th>
                                                <td>MAD{{ Cart::instance('cart')->tax() }}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>MAD{{ Cart::instance('cart')->total() }}</strong></td>
                                            </tr>
                                        @endif

                                    </tbody>
                                </table>
                            </div>
                            <div class="mobile_fixed-btn_wrapper">
                                <div class="button-wrapper container">
                                    <a href="{{route('cart.checkout')}}" class="btn btn-primary btn-checkout">PROCEED TO CHECKOUT</a>
                                </div>
                            </div>
                        </div>
                    </div>
                @else
                    <div class="row">
                        <div class="col-md-12 text-center pt-5 pb-5">
                            <p>No items found in your cart</p>
                            <a href="{{ route('shop.index') }}" class="btn btn-info">Shop Now</a>
                        </div>
                    </div>
                @endif
            </div>
        </section>
    </main>
@endsection

@push('scripts')
    <script>
        $(function() {
            $(".qty-control__increase, .qty-control__reduce, .remove-cart").on("click", function(e) {
                e.preventDefault();
                $(this).closest('form').submit();
            });
        });
    </script>
@endpush
