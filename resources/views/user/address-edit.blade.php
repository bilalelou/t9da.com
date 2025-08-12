@extends('layouts.app')

@section('content')
    <main class="pt-90">
        <div class="mb-4 pb-4"></div>
        <section class="my-account container">
            <h2 class="page-title">Edit Address</h2>
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
                    <div class="page-content">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <p class="notice">Update your address information.</p>
                            <a href="{{ route('user.address') }}" class="btn btn-outline-secondary">
                                <i class="fa fa-arrow-left"></i> Back to Addresses
                            </a>
                        </div>

                        @if (Session::has('status'))
                            <div class="alert alert-success">{{ Session::get('status') }}</div>
                        @endif

                        <div class="card">
                            <div class="card-body">
                                <form action="{{ route('user.address.update', ['id' => $address->id]) }}" method="POST" class="address-form">
                                    @csrf
                                    @method('PUT')

                                    <div class="row">
                                        <!-- Full Name -->
                                        <div class="col-md-6 mb-3">
                                            <label for="name" class="form-label">Full Name <span class="text-danger">*</span></label>
                                            <input type="text"
                                                   class="form-control @error('name') is-invalid @enderror"
                                                   id="name"
                                                   name="name"
                                                   value="{{ old('name', $address->name) }}"
                                                   placeholder="Enter your full name"
                                                   required>
                                            @error('name')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>

                                        <!-- Phone Number -->
                                        <div class="col-md-6 mb-3">
                                            <label for="phone" class="form-label">Phone Number <span class="text-danger">*</span></label>
                                            <input type="tel"
                                                   class="form-control @error('phone') is-invalid @enderror"
                                                   id="phone"
                                                   name="phone"
                                                   value="{{ old('phone', $address->phone) }}"
                                                   placeholder="Enter your phone number"
                                                   pattern="[0-9]{10}"
                                                   maxlength="10"
                                                   required>
                                            @error('phone')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                            <small class="form-text text-muted">Enter 10-digit phone number</small>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <!-- Country -->
                                        <div class="col-md-6 mb-3">
                                            <label for="country" class="form-label">Country</label>
                                            <input type="text"
                                                   class="form-control"
                                                   id="country"
                                                   name="country"
                                                   value="Morocco"
                                                   readonly>
                                            <small class="form-text text-muted">Currently set to Morocco</small>
                                        </div>

                                        <!-- State/Province -->
                                        <div class="col-md-6 mb-3">
                                            <label for="state" class="form-label">State/Province <span class="text-danger">*</span></label>
                                            <input type="text"
                                                   class="form-control @error('state') is-invalid @enderror"
                                                   id="state"
                                                   name="state"
                                                   value="{{ old('state', $address->state) }}"
                                                   placeholder="Enter state or province"
                                                   required>
                                            @error('state')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="row">
                                        <!-- City -->
                                        <div class="col-md-6 mb-3">
                                            <label for="city" class="form-label">City <span class="text-danger">*</span></label>
                                            <input type="text"
                                                   class="form-control @error('city') is-invalid @enderror"
                                                   id="city"
                                                   name="city"
                                                   value="{{ old('city', $address->city) }}"
                                                   placeholder="Enter city name"
                                                   required>
                                            @error('city')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>

                                        <!-- ZIP/Postal Code -->
                                        <div class="col-md-6 mb-3">
                                            <label for="zip" class="form-label">ZIP/Postal Code <span class="text-danger">*</span></label>
                                            <input type="text"
                                                   class="form-control @error('zip') is-invalid @enderror"
                                                   id="zip"
                                                   name="zip"
                                                   value="{{ old('zip', $address->zip) }}"
                                                   placeholder="Enter ZIP code"
                                                   pattern="[0-9]{6}"
                                                   maxlength="6"
                                                   required>
                                            @error('zip')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                            <small class="form-text text-muted">Enter 6-digit ZIP code</small>
                                        </div>
                                    </div>

                                    <!-- Address Line 1 -->
                                    <div class="mb-3">
                                        <label for="address" class="form-label">Address Line 1 <span class="text-danger">*</span></label>
                                        <input type="text"
                                               class="form-control @error('address') is-invalid @enderror"
                                               id="address"
                                               name="address"
                                               value="{{ old('address', $address->address) }}"
                                               placeholder="Street address, P.O. box, company name"
                                               required>
                                        @error('address')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <!-- Address Line 2 (Locality) -->
                                    <div class="mb-3">
                                        <label for="locality" class="form-label">Address Line 2 (Locality) <span class="text-danger">*</span></label>
                                        <input type="text"
                                               class="form-control @error('locality') is-invalid @enderror"
                                               id="locality"
                                               name="locality"
                                               value="{{ old('locality', $address->locality) }}"
                                               placeholder="Apartment, suite, unit, building, floor, etc."
                                               required>
                                        @error('locality')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <!-- Landmark -->
                                    <div class="mb-3">
                                        <label for="landmark" class="form-label">Landmark <span class="text-danger">*</span></label>
                                        <input type="text"
                                               class="form-control @error('landmark') is-invalid @enderror"
                                               id="landmark"
                                               name="landmark"
                                               value="{{ old('landmark', $address->landmark) }}"
                                               placeholder="Nearby landmark or reference point"
                                               required>
                                        @error('landmark')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                        <small class="form-text text-muted">Help delivery drivers find your location easily</small>
                                    </div>

                                    <!-- Default Address Option -->
                                    <div class="mb-4">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="set_as_default" name="set_as_default" {{ $address->isdefault ? 'checked' : '' }}>
                                            <label class="form-check-label" for="set_as_default">
                                                Set as default address
                                            </label>
                                        </div>
                                        <small class="form-text text-muted">This address will be used as the default for future orders</small>
                                    </div>

                                    <!-- Submit Buttons -->
                                    <div class="d-flex justify-content-between">
                                        <a href="{{ route('user.address') }}" class="btn btn-outline-secondary">
                                            <i class="fa fa-times"></i> Cancel
                                        </a>
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fa fa-save"></i> Update Address
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection

@push('styles')
<style>
    .address-form {
        max-width: 100%;
    }

    .form-label {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .form-control {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 12px 15px;
        transition: all 0.3s ease;
    }

    .form-control:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .form-control.is-invalid {
        border-color: #dc3545;
    }

    .invalid-feedback {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }

    .card {
        border: none;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
    }

    .card-body {
        padding: 2rem;
    }

    .btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
    }

    .btn-primary:hover {
        background-color: #0056b3;
        border-color: #0056b3;
    }

    .btn-outline-secondary {
        color: #6c757d;
        border-color: #6c757d;
    }

    .btn-outline-secondary:hover {
        background-color: #6c757d;
        border-color: #6c757d;
    }

    .form-check-input:checked {
        background-color: #007bff;
        border-color: #007bff;
    }

    .notice {
        color: #6c757d;
        font-style: italic;
        margin-bottom: 0;
    }

    .page-title {
        color: #333;
        font-weight: 700;
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        .card-body {
            padding: 1.5rem;
        }

        .d-flex.justify-content-between {
            flex-direction: column;
            gap: 1rem;
        }

        .d-flex.justify-content-between .btn {
            width: 100%;
        }
    }
</style>
@endpush

@push('scripts')
<script>
    $(document).ready(function() {
        // Phone number formatting
        $('#phone').on('input', function() {
            var value = $(this).val().replace(/\D/g, '');
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            $(this).val(value);
        });

        // ZIP code formatting
        $('#zip').on('input', function() {
            var value = $(this).val().replace(/\D/g, '');
            if (value.length > 6) {
                value = value.substring(0, 6);
            }
            $(this).val(value);
        });

        // Form validation
        $('.address-form').on('submit', function(e) {
            var isValid = true;

            // Check required fields
            $(this).find('[required]').each(function() {
                if (!$(this).val().trim()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });

            // Phone validation
            var phone = $('#phone').val();
            if (phone && phone.length !== 10) {
                $('#phone').addClass('is-invalid');
                isValid = false;
            }

            // ZIP validation
            var zip = $('#zip').val();
            if (zip && zip.length !== 6) {
                $('#zip').addClass('is-invalid');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $('.is-invalid:first').offset().top - 100
                }, 500);
            }
        });

        // Remove invalid class on input
        $('.form-control').on('input', function() {
            $(this).removeClass('is-invalid');
        });
    });
</script>
@endpush
