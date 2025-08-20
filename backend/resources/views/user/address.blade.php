@extends('layouts.app')

@section('content')
    <main class="pt-90">
        <div class="mb-4 pb-4"></div>
        <section class="my-account container">
            <h2 class="page-title">Addresses</h2>
            <div class="row">
                <div class="col-lg-3">
                    <ul class="account-nav">
                        <li><a href="{{ route('user.index') }}" class="menu-link menu-link_us-s">Dashboard</a></li>
                        <li><a href="{{ route('user.orders') }}" class="menu-link menu-link_us-s">Orders</a></li>
                        <li><a href="{{ route('user.address') }}" class="menu-link menu-link_us-s menu-link_active">Addresses</a></li>
                        <li><a href="{{ route('user.account.details')}}" class="menu-link menu-link_us-s">Account Details</a></li>
                        <li><a href="{{ route('wishlist.index') }}" class="menu-link menu-link_us-s">Wishlist</a></li>
                        <li>
                            <form action="{{ route('logout') }}" method="POST" style="display:inline;">
                                @csrf
                                <button type="submit" class="menu-link menu-link_us-s btn btn-link p-0 m-0" style="text-decoration:none;">Logout</button>
                            </form>
                        </li>
                    </ul>
                </div>

                <div class="col-lg-9">
                    <div class="page-content my-account__address">
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="notice">The following addresses will be used on the checkout page by default.</p>
                            <a href="{{ route('user.address.add') }}" class="btn btn-primary">Add New Address</a>
                        </div>
                        <hr>
                        @if (Session::has('status'))
                            <div class="alert alert-success">{{ Session::get('status') }}</div>
                        @endif

                        <div class="my-account__address-list row">
                            @forelse($addresses as $address)
                                <div class="my-account__address-item col-md-6 mb-4">
                                    <div class="my-account__address-item__title d-flex justify-content-between">
                                        <h5>
                                            {{ $address->name }}
                                            @if($address->isdefault)
                                                <i class="fa fa-check-circle text-success" title="Default Address"></i>
                                            @endif
                                        </h5>
                                        <a href="{{ route('user.address.edit', ['id' => $address->id]) }}" >
                                           Edit
                                        </a>
                                    </div>
                                    <div class="my-account__address-item__detail">
                                        <p>{{ $address->address }}, {{ $address->locality }}</p>
                                        <p>{{ $address->city }}, {{ $address->state }} {{ $address->zip }}</p>
                                        <p>{{ $address->country }}</p>
                                        <p><strong>Phone:</strong> {{ $address->phone }}</p>
                                    </div>
                                    <div class="d-flex mt-2">
                                        @if(!$address->isdefault)
                                            <form action="{{ route('user.address.setDefault', ['id' => $address->id]) }}" method="POST">
                                                @csrf
                                                <button type="submit" class="btn btn-sm btn-outline-success me-2">Set as Default</button>
                                            </form>
                                        @endif

                                        <form action="{{ route('user.address.delete', ['id' => $address->id]) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <button type="button" class="btn btn-sm btn-outline-danger delete-address">Delete</button>
                                        </form>
                                    </div>
                                </div>
                            @empty
                                <div class="col-12">
                                    <p>You have not saved any addresses yet.</p>
                                </div>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection

@push('scripts')
<script>
    $(function(){
        $('.delete-address').on('click', function(e) {
            e.preventDefault();
            var form = $(this).closest('form');
            swal({
                title: "Are you sure?",
                text: "You want to delete this address?",
                type: "warning",
                buttons: ["Cancel", "Yes, delete it!"],
                dangerMode: true,
            }).then(function(willDelete) {
                if (willDelete) {
                    form.submit();
                }
            });
        });
    });
</script>
@endpush
