@extends('layouts.app')

@section('content')
    <main class="pt-90">
        <div class="mb-4 pb-4"></div>
        <section class="my-account container">
            <h2 class="page-title">Account Details</h2>
            <div class="row">
                <div class="col-lg-3">
                    <ul class="account-nav">
                        <li><a href="{{ route('user.index') }}" class="menu-link menu-link_us-s">Dashboard</a></li>
                        <li><a href="{{ route('user.orders') }}" class="menu-link menu-link_us-s">Orders</a></li>
                        <li><a href="{{ route('user.address') }}" class="menu-link menu-link_us-s">Addresses</a></li>
                        <li><a href="{{ route('user.account.details') }}" class="menu-link menu-link_us-s menu-link_active">Account Details</a></li>
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
                            <p class="notice">Manage your account information and security settings.</p>
                        </div>

                        <!-- Profile Information Section -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fa fa-user"></i> Profile Information
                                </h5>
                            </div>
                            <div class="card-body">
                                @if (Session::has('profile_status'))
                                    <div class="alert alert-success">{{ Session::get('profile_status') }}</div>
                                @endif

                                <form action="{{ route('user.profile.update') }}" method="POST" class="profile-form">
                                    @csrf

                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="name" class="form-label">Full Name <span class="text-danger">*</span></label>
                                            <input type="text"
                                                   class="form-control @error('name') is-invalid @enderror"
                                                   id="name"
                                                   name="name"
                                                   value="{{ old('name', $user->name) }}"
                                                   placeholder="Enter your full name"
                                                   required>
                                            @error('name')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>

                                        <div class="col-md-6 mb-3">
                                            <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
                                            <input type="email"
                                                   class="form-control @error('email') is-invalid @enderror"
                                                   id="email"
                                                   name="email"
                                                   value="{{ old('email', $user->email) }}"
                                                   placeholder="Enter your email address"
                                                   required>
                                            @error('email')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="created_at" class="form-label">Member Since</label>
                                            <input type="text"
                                                   class="form-control"
                                                   id="created_at"
                                                   value="{{ $user->created_at->format('F d, Y') }}"
                                                   readonly>
                                            <small class="form-text text-muted">Account creation date</small>
                                        </div>

                                        <div class="col-md-6 mb-3">
                                            <label for="last_login" class="form-label">Last Login</label>
                                            <input type="text"
                                                   class="form-control"
                                                   id="last_login"
                                                   value="{{ $user->updated_at->format('F d, Y \a\t h:i A') }}"
                                                   readonly>
                                            <small class="form-text text-muted">Last account activity</small>
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-end">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fa fa-save"></i> Update Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Password Change Section -->
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fa fa-lock"></i> Change Password
                                </h5>
                            </div>
                            <div class="card-body">
                                @if (Session::has('password_status'))
                                    <div class="alert alert-success">{{ Session::get('password_status') }}</div>
                                @endif

                                @if (Session::has('password_error'))
                                    <div class="alert alert-danger">{{ Session::get('password_error') }}</div>
                                @endif

                                <form action="{{ route('user.password.update') }}" method="POST" class="password-form">
                                    @csrf

                                    <div class="row">
                                        <div class="col-md-12 mb-3">
                                            <label for="current_password" class="form-label">Current Password <span class="text-danger">*</span></label>
                                            <div class="input-group">
                                                <input type="password"
                                                       class="form-control @error('current_password') is-invalid @enderror"
                                                       id="current_password"
                                                       name="current_password"
                                                       placeholder="Enter your current password"
                                                       required>
                                                <button class="btn btn-outline-secondary" type="button" id="toggleCurrentPassword">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                            </div>
                                            @error('current_password')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="new_password" class="form-label">New Password <span class="text-danger">*</span></label>
                                            <div class="input-group">
                                                <input type="password"
                                                       class="form-control @error('new_password') is-invalid @enderror"
                                                       id="new_password"
                                                       name="new_password"
                                                       placeholder="Enter new password"
                                                       required>
                                                <button class="btn btn-outline-secondary" type="button" id="toggleNewPassword">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                            </div>
                                            @error('new_password')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                            <small class="form-text text-muted">Minimum 8 characters</small>
                                        </div>

                                        <div class="col-md-6 mb-3">
                                            <label for="new_password_confirmation" class="form-label">Confirm New Password <span class="text-danger">*</span></label>
                                            <div class="input-group">
                                                <input type="password"
                                                       class="form-control @error('new_password_confirmation') is-invalid @enderror"
                                                       id="new_password_confirmation"
                                                       name="new_password_confirmation"
                                                       placeholder="Confirm new password"
                                                       required>
                                                <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                            </div>
                                            @error('new_password_confirmation')
                                                <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="password-strength mb-3" id="passwordStrength" style="display: none;">
                                        <label class="form-label">Password Strength:</label>
                                        <div class="progress" style="height: 8px;">
                                            <div class="progress-bar" id="strengthBar" role="progressbar" style="width: 0%"></div>
                                        </div>
                                        <small class="form-text" id="strengthText"></small>
                                    </div>

                                    <div class="d-flex justify-content-end">
                                        <button type="submit" class="btn btn-warning">
                                            <i class="fa fa-key"></i> Change Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Account Security Tips -->
                        <div class="card mt-4">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fa fa-shield"></i> Security Tips
                                </h5>
                            </div>
                            <div class="card-body">
                                <ul class="list-unstyled mb-0">
                                    <li class="mb-2">
                                        <i class="fa fa-check-circle text-success me-2"></i>
                                        Use a strong password with at least 8 characters
                                    </li>
                                    <li class="mb-2">
                                        <i class="fa fa-check-circle text-success me-2"></i>
                                        Include a mix of letters, numbers, and special characters
                                    </li>
                                    <li class="mb-2">
                                        <i class="fa fa-check-circle text-success me-2"></i>
                                        Never share your password with anyone
                                    </li>
                                    <li class="mb-2">
                                        <i class="fa fa-check-circle text-success me-2"></i>
                                        Log out when using shared computers
                                    </li>
                                    <li class="mb-0">
                                        <i class="fa fa-check-circle text-success me-2"></i>
                                        Keep your email address updated for account recovery
                                    </li>
                                </ul>
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
    .card {
        border: none;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        margin-bottom: 1.5rem;
    }

    .card-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        border-radius: 12px 12px 0 0 !important;
        padding: 1rem 1.5rem;
    }

    .card-header h5 {
        color: #333;
        font-weight: 600;
        margin: 0;
    }

    .card-body {
        padding: 1.5rem;
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

    .btn-warning {
        background-color: #ffc107;
        border-color: #ffc107;
        color: #212529;
    }

    .btn-warning:hover {
        background-color: #e0a800;
        border-color: #d39e00;
        color: #212529;
    }

    .btn-outline-secondary {
        color: #6c757d;
        border-color: #6c757d;
    }

    .btn-outline-secondary:hover {
        background-color: #6c757d;
        border-color: #6c757d;
    }

    .input-group .btn {
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .input-group .form-control {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .progress {
        border-radius: 10px;
        background-color: #e9ecef;
    }

    .progress-bar {
        border-radius: 10px;
        transition: width 0.3s ease;
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

    .alert {
        border-radius: 8px;
        border: none;
    }

    .alert-success {
        background-color: #d4edda;
        color: #155724;
    }

    .alert-danger {
        background-color: #f8d7da;
        color: #721c24;
    }

    @media (max-width: 768px) {
        .card-body {
            padding: 1rem;
        }

        .d-flex.justify-content-end {
            justify-content: center !important;
        }

        .btn {
            width: 100%;
            margin-top: 0.5rem;
        }
    }
</style>
@endpush

@push('scripts')
<script>
    $(document).ready(function() {
        // Password visibility toggles
        $('#toggleCurrentPassword').on('click', function() {
            togglePasswordVisibility('#current_password', this);
        });

        $('#toggleNewPassword').on('click', function() {
            togglePasswordVisibility('#new_password', this);
        });

        $('#toggleConfirmPassword').on('click', function() {
            togglePasswordVisibility('#new_password_confirmation', this);
        });

        function togglePasswordVisibility(inputId, button) {
            const input = $(inputId);
            const icon = $(button).find('i');

            if (input.attr('type') === 'password') {
                input.attr('type', 'text');
                icon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                input.attr('type', 'password');
                icon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        }

        // Password strength checker
        $('#new_password').on('input', function() {
            const password = $(this).val();
            const strength = checkPasswordStrength(password);
            updatePasswordStrengthUI(strength);
        });

        function checkPasswordStrength(password) {
            let score = 0;
            let feedback = [];

            if (password.length >= 8) {
                score += 25;
            } else {
                feedback.push('At least 8 characters');
            }

            if (/[a-z]/.test(password)) {
                score += 25;
            } else {
                feedback.push('Include lowercase letters');
            }

            if (/[A-Z]/.test(password)) {
                score += 25;
            } else {
                feedback.push('Include uppercase letters');
            }

            if (/[0-9]/.test(password)) {
                score += 25;
            } else {
                feedback.push('Include numbers');
            }

            return { score, feedback };
        }

        function updatePasswordStrengthUI(strength) {
            const strengthBar = $('#strengthBar');
            const strengthText = $('#strengthText');
            const strengthContainer = $('#passwordStrength');

            if (strength.score === 0) {
                strengthContainer.hide();
                return;
            }

            strengthContainer.show();

            let color, text;
            if (strength.score <= 25) {
                color = '#dc3545';
                text = 'Very Weak';
            } else if (strength.score <= 50) {
                color = '#fd7e14';
                text = 'Weak';
            } else if (strength.score <= 75) {
                color = '#ffc107';
                text = 'Moderate';
            } else {
                color = '#28a745';
                text = 'Strong';
            }

            strengthBar.css('width', strength.score + '%').css('background-color', color);
            strengthText.text(text).css('color', color);
        }

        // Form validation
        $('.profile-form, .password-form').on('submit', function(e) {
            var isValid = true;
            const form = $(this);

            // Check required fields
            form.find('[required]').each(function() {
                if (!$(this).val().trim()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });

            // Password confirmation validation
            if (form.hasClass('password-form')) {
                const newPassword = $('#new_password').val();
                const confirmPassword = $('#new_password_confirmation').val();

                if (newPassword && confirmPassword && newPassword !== confirmPassword) {
                    $('#new_password_confirmation').addClass('is-invalid');
                    isValid = false;
                } else {
                    $('#new_password_confirmation').removeClass('is-invalid');
                }
            }

            if (!isValid) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: form.find('.is-invalid:first').offset().top - 100
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
