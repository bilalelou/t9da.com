@extends('layouts.admin')

@section('content')
<div class="main-content-inner">
    <div class="main-content-wrap">
        {{-- Header and Breadcrumbs --}}
        <div class="flex items-center flex-wrap justify-between gap20 mb-27">
            <h3>Edit Shipping Fee</h3>
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
                    <a href="{{ route('admin.shipping_fees.index') }}">
                        <div class="text-tiny">Shipping Fees</div>
                    </a>
                </li>
                <li>
                    <i class="icon-chevron-right"></i>
                </li>
                <li>
                    <div class="text-tiny">Edit Fee</div>
                </li>
            </ul>
        </div>

        {{-- Edit Shipping Fee Form --}}
        <div class="wg-box">
            <form class="form-new-product form-style-1" action="{{ route('admin.shipping_fees.update', ['id' => $fee->id]) }}" method="POST">
                @csrf
                @method('PUT')
                <input type="hidden" name="id" value="{{ $fee->id }}" />

                <fieldset class="name">
                    <div class="body-title">Region Name <span class="tf-color-1">*</span></div>
                    <input class="flex-grow" type="text" placeholder="e.g., Inside City" name="region" value="{{ $fee->region }}" required>
                </fieldset>
                @error('region')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror

                <fieldset class="name">
                    <div class="body-title">Shipping Cost <span class="tf-color-1">*</span></div>
                    <input class="flex-grow" type="number" step="0.01" placeholder="e.g., 10.50" name="cost" value="{{ $fee->cost }}" required>
                </fieldset>
                @error('cost')
                    <div class="alert alert-danger">{{ $message }}</div>
                @enderror

                <div class="bot">
                    <div></div> {{-- This empty div is for alignment --}}
                    <button class="tf-button w208" type="submit">Update</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
