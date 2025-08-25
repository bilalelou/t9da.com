@extends('layouts.admin')

@section('content')
<div class="main-content-inner">
    <div class="main-content-wrap">
        {{-- Header and Breadcrumbs --}}
        <div class="flex items-center flex-wrap justify-between gap20 mb-27">
            <h3>Shipping Fees</h3>
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
                    <div class="text-tiny">Shipping Fees</div>
                </li>
            </ul>
        </div>

        {{-- Main Content Box --}}
        <div class="wg-box">
            <div class="flex items-center justify-between gap10 flex-wrap">
                <div class="wg-filter flex-grow">
                    {{-- Search Form --}}
                    <form class="form-search">
                        <fieldset class="name">
                            <input type="text" placeholder="Search here..." class="" name="name" tabindex="2" value="" aria-required="true" required="">
                        </fieldset>
                        <div class="button-submit">
                            <button class="" type="submit"><i class="icon-search"></i></button>
                        </div>
                    </form>
                </div>
                {{-- Add New Button --}}
                <a class="tf-button style-1 w208" href="{{ route('admin.shipping_fees.add') }}">
                    <i class="icon-plus"></i>Add New
                </a>
            </div>

            <div class="wg-table table-all-user">
                <div class="table-responsive">
                    {{-- Success/Error Messages --}}
                    @if (session('success'))
                        <div class="alert alert-success" role="alert">
                            {{ session('success') }}
                        </div>
                    @endif
                    @if (session('error'))
                        <div class="alert alert-danger" role="alert">
                            {{ session('error') }}
                        </div>
                    @endif

                    {{-- Shipping Fees Table --}}
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Region Name</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($shipping_fees as $fee)
                                <tr>
                                    <td>{{ $fee->id }}</td>
                                    <td>{{ $fee->region }}</td>
                                    <td>${{ number_format($fee->cost, 2) }}</td>
                                    <td>
                                        <div class="list-icon-function">
                                            {{-- Edit Action --}}
                                            <a href="{{ route('admin.shipping_fees.edit', ['id' => $fee->id]) }}">
                                                <div class="item edit">
                                                    <i class="icon-edit-3"></i>
                                                </div>
                                            </a>
                                            {{-- Delete Action --}}
                                            <form action="{{ route('admin.shipping_fees.destroy', ['id' => $fee->id]) }}" method="POST" class="delete-form">
                                                @csrf
                                                @method('DELETE')
                                                <button type="button" class="item text-danger delete-button" style="background:none; border:none; cursor:pointer; padding:0;">
                                                    <i class="icon-trash-2"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center">No shipping fees have been added yet.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="divider"></div>
                <div class="flex items-center justify-between flex-wrap gap10 wgp-pagination">
                    {{-- Pagination Links --}}
                    {{ $shipping_fees->links('pagination::bootstrap-5') }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    // SweetAlert for delete confirmation
    $(function() {
        $('.delete-button').on('click', function(e) {
            e.preventDefault();
            var form = $(this).closest('form');
            swal({
                title: "Are you sure?",
                text: "You want to delete this shipping fee?",
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
