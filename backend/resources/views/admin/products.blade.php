@extends('layouts.admin')
@section('content')
    <div class="main-content-inner">
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>All Products</h3>
                <ul class="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li>
                        <a href="{{ route('admin.index') }}">
                            <div class="text-tiny">Dashboard</div>
                        </a>
                    </li>
                    <li>
                        <i class="icon-chevron-right"></i>
                    </li>
                    <li>
                        <div class="text-tiny">All Products</div>
                    </li>
                </ul>
            </div>

            <div class="wg-box">
                <div class="flex items-center justify-between gap10 flex-wrap">
                    <div class="wg-filter flex-grow">
                        {{-- نموذج البحث --}}
                    </div>
                    <a class="tf-button style-1 w208" href="{{ route('admin.product.add') }}"><i class="icon-plus"></i>Add new</a>
                </div>
                <div class="table-responsive">
                    @if (Session::has('status'))
                        <div class="alert alert-success">{{ Session::get('status') }}</div>
                    @endif
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>SalePrice</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Featured</th>
                                <th>Stock</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($products as $product)
                                <tr>
                                    <td>{{ $product->id }}</td>
                                    <td class="pname">
                                        <div class="image">
                                            @if($product->image)
                                                <img src="{{ asset('storage/uploads/' . $product->image) }}"
                                                     alt="{{ $product->name }}" class="image" width="60">
                                            @else
                                                <img src="https://placehold.co/60x60/EFEFEF/AAAAAA?text=No+Image"
                                                     alt="No Image" class="image" width="60">
                                            @endif
                                        </div>
                                        <div class="name">
                                            <a href="#" class="body-title-2">{{ $product->name }}</a>
                                            <div class="text-tiny mt-3">{{ $product->slug }}</div>
                                        </div>
                                    </td>
                                    <td>MAD{{ $product->regular_price }}</td>
                                    <td>MAD{{ $product->sale_price }}</td>
                                    <td>{{ $product->SKU }}</td>
                                    <td>{{ $product->category->name }}</td>
                                    <td>{{ $product->brand->name }}</td>
                                    <td>{{ $product->featured == 0 ? 'No' : 'Yes' }}</td>
                                    <td>{{ $product->stock_status }}</td>
                                    <td>{{ $product->quantity }}</td>
                                    <td>
                                        <div class="list-icon-function">
                                            <a href="{{ route('shop.product.details', ['product_slug' => $product->slug]) }}" target="_blank" title="View">
                                                <div class="item eye"><i class="icon-eye"></i></div>
                                            </a>
                                            <a href="{{ route('admin.product.edit', ['id' => $product->id]) }}" title="Edit">
                                                <div class="item edit"><i class="icon-edit-3"></i></div>
                                            </a>
                                            <form action="{{route('admin.product.delete',['id'=>$product->id])}}" method="POST" style="display:inline;">
                                                @csrf
                                                @method('DELETE')
                                                <button type="button" class="item text-danger delete" style="background: none; border: none; cursor: pointer; padding: 0;" title="Delete">
                                                    <i class="icon-trash-2"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <div class="divider"></div>
                <div class="flex items-center justify-between flex-wrap gap10 wgp-pagination">
                    {{ $products->links('pagination::bootstrap-5') }}
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        $(function(){
            $(".delete").on('click',function(e){
                e.preventDefault();
                var selectedForm = $(this).closest('form');
                swal({
                    title: "Are you sure?",
                    text: "You want to delete this record?",
                    type: "warning",
                    buttons: ["No!", "Yes!"],
                    dangerMode: true,
                }).then(function (willDelete) {
                    if (willDelete) {
                        selectedForm.submit();
                    }
                });
            });
        });
    </script>
@endpush
