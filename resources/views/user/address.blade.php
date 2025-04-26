@extends('layouts.app')

@section('content')
    <main class="pt-90">
        <div class="mb-4 pb-4"></div>
        <section class="my-account container">
            <h2 class="page-title">Addresses</h2>
            <div class="row">
                <div class="col-lg-3">
                    <ul class="account-nav">
                        <li><a href="#" class="menu-link menu-link_us-s">Dashboard</a></li>
                        <li><a href="#" class="menu-link menu-link_us-s">Orders</a></li>
                        <li><a href="#" class="menu-link menu-link_us-s menu-link_active">Addresses</a></li>
                        <li><a href="#" class="menu-link menu-link_us-s">Account Details</a></li>
                        <li><a href="#" class="menu-link menu-link_us-s">Wishlist</a></li>
                        <li>
                            <form action="{{ route('logout') }}" method="POST" style="display:inline;">
                                @csrf
                                <button type="submit" class="menu-link menu-link_us-s btn btn-link p-0 m-0"
                                    style="text-decoration:none;">Logout</button>
                            </form>
                        </li>
                    </ul>
                </div>

                <div class="col-lg-9">
                    <div class="page-content my-account__address">
                        <div class="row">
                            <div class="col-6">
                                <p class="notice">The following addresses will be used on the checkout page by default.</p>
                            </div>
                            <div class="col-6 text-right">
                                <a href="{{ route('user.address.add') }}" class="btn btn-sm btn-info">Add New</a>
                            </div>
                        </div>

                        <div class="my-account__address-list row">
                            <h5>Shipping Address</h5>

                            <div class="my-account__address-item col-md-6">
                                <div class="my-account__address-item__title">
                                    <h5>{{ auth()->user()->name }} <i class="fa fa-check-circle text-success"></i></h5>
                                    <a href="#">Edit</a>
                                </div>
                                <div class="my-account__address-item__detail">
                                    <p>{{ auth()->user()->address ?? 'No address available' }}</p>
                                    <p>{{ auth()->user()->city ?? '' }}</p>
                                    <p>{{ auth()->user()->state ?? '' }}</p>
                                    <p>{{ auth()->user()->landmark ?? '' }}</p>
                                    <p>{{ auth()->user()->zip_code ?? '' }}</p>
                                    <br>
                                    <p>Mobile : {{ auth()->user()->mobile ?? 'No phone available' }}</p>
                                </div>
                            </div>
                            <hr>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    </main>
@endsection
