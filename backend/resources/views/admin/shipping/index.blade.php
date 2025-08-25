@extends('layouts.admin')

@section('content')
    <div class="main-content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="box-title">Shipping Fees Management</h4>
                        {{-- You can add a button here if needed --}}
                    </div>

                    {{-- Session Messages for Success/Error --}}
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

                    <div class="row">
                        <div class="col-md-4">
                            <div class="box-content card">
                                <div class="card-header">
                                    <h5 class="card-title">Add New Shipping Region</h5>
                                </div>
                                <div class="card-body">
                                    {{-- The form should point to a 'store' route --}}
                                    <form action="#" method="POST">
                                        @csrf
                                        <div class="mb-3">
                                            <label for="region" class="form-label">Region Name</label>
                                            <input type="text" class="form-control" id="region" name="region" placeholder="e.g., Inside City" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="cost" class="form-label">Shipping Cost ($)</label>
                                            <input type="number" step="0.01" class="form-control" id="cost" name="cost" placeholder="e.g., 10.50" required>
                                        </div>
                                        <button type="submit" class="btn btn-primary w-100">Add Region</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-8">
                            <div class="box-content card">
                                <div class="card-header">
                                    <h5 class="card-title">Existing Shipping Regions</h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Region Name</th>
                                                    <th>Shipping Cost</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @forelse ($shipping_fees as $fee)
                                                    <tr>
                                                        <td>{{ $fee->id }}</td>
                                                        <td>{{ $fee->region }}</td>
                                                        <td>${{ number_format($fee->cost, 2) }}</td>
                                                        <td>
                                                            {{-- Edit and Delete buttons --}}
                                                            {{-- Note: You will need to create routes and methods for these actions --}}
                                                            <a href="#" class="btn btn-sm btn-info">Edit</a>
                                                            <form action="{{ route('admin.shipping_fees.destroy', $fee->id) }}" method="POST" style="display:inline-block;">
                                                                @csrf
                                                                @method('DELETE')
                                                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this?')">Delete</button>
                                                            </form>
                                                        </td>
                                                    </tr>
                                                @empty
                                                    <tr>
                                                        <td colspan="4" class="text-center">No shipping fees defined yet.</td>
                                                    </tr>
                                                @endforelse
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
