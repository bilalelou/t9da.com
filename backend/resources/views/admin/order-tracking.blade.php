@extends('layouts.admin')
@section('content')
    <div class="main-content-inner">
        <div class="main-content-wrap">
            <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                <h3>Order Tracking</h3>
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
                        <div class="text-tiny">Order Tracking</div>
                    </li>
                </ul>
            </div>

            <div class="wg-box">
                <!-- Search and Filter Section -->
                <div class="flex items-center justify-between gap10 flex-wrap mb-20">
                    <div class="wg-filter flex-grow">
                            <form class="form-search" method="GET" action="{{ route('admin.orders') }}">
                        <fieldset class="name">
                            <input type="text" placeholder="Search by order ID, customer name..." class="" name="search" value="{{ request('search') }}">
                        </fieldset>
                        <div class="button-submit">
                            <button class="" type="submit"><i class="icon-search"></i></button>
                        </div>
                    </form>
                    </div>
                    <div class="flex items-center gap10">
                      <form id="filter-form" method="GET" action="{{ route('admin.orders') }}">
                        <input type="hidden" name="search" value="{{ request('search') }}">
                        <select name="status_filter" class="form-select" onchange="this.form.submit()">
                            <option value="">All Status</option>
                            <option value="ordered" @if(request('status_filter') == 'ordered') selected @endif>Ordered</option>
                            <option value="shipped" @if(request('status_filter') == 'shipped') selected @endif>Shipped</option>
                            <option value="delivered" @if(request('status_filter') == 'delivered') selected @endif>Delivered</option>
                            <option value="canceled" @if(request('status_filter') == 'canceled') selected @endif>Canceled</option>
                        </select>
                    </form>
                    </div>
                </div>

                <!-- Order Tracking Table -->
                <div class="wg-table table-all-user">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th style="width:80px">Order ID</th>
                                    <th class="text-center">Customer</th>
                                    <th class="text-center">Contact</th>
                                    <th class="text-center">Items</th>
                                    <th class="text-center">Total</th>
                                    <th class="text-center">Status</th>
                                    <th class="text-center">Order Date</th>
                                    <th class="text-center">Tracking Info</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($orders as $order)
                                    <tr>
                                        <td class="text-center">
                                            <strong>#{{ $order->id }}</strong>
                                        </td>
                                        <td class="text-center">
                                            <div class="customer-info">
                                                <div class="font-weight-bold">{{ $order->name }}</div>
                                                @if($order->user)
                                                    <small class="text-muted">User ID: {{ $order->user->id }}</small>
                                                @endif
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <div class="contact-info">
                                                <div>{{ $order->phone }}</div>
                                                <small class="text-muted">{{ $order->email ?? 'N/A' }}</small>
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <div class="items-info">
                                                <span class="badge bg-info">{{ $order->orderItems->count() }} items</span>
                                                <div class="mt-2">
                                                    @foreach($order->orderItems->take(2) as $item)
                                                        <small class="d-block">{{ $item->product->name ?? 'Product N/A' }} ({{ $item->quantity }})</small>
                                                    @endforeach
                                                    @if($order->orderItems->count() > 2)
                                                        <small class="text-muted">+{{ $order->orderItems->count() - 2 }} more</small>
                                                    @endif
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <div class="amount-info">
                                                <div class="font-weight-bold">${{ number_format($order->total, 2) }}</div>
                                                <small class="text-muted">
                                                    Sub: ${{ number_format($order->subtotal, 2) }}<br>
                                                    Tax: ${{ number_format($order->tax, 2) }}
                                                </small>
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            @if ($order->status == 'delivered')
                                                <span class="badge bg-success">Delivered</span>
                                                @if($order->delivered_date)
                                                    <div class="mt-1">
                                                        <small class="text-muted">{{ \Carbon\Carbon::parse($order->delivered_date)->format('M d, Y') }}</small>
                                                    </div>
                                                @endif
                                            @elseif($order->status == 'shipped')
                                                <span class="badge bg-primary">Shipped</span>
                                            @elseif($order->status == 'canceled')
                                                <span class="badge bg-danger">Canceled</span>
                                                @if($order->canceled_date)
                                                    <div class="mt-1">
                                                        <small class="text-muted">{{ \Carbon\Carbon::parse($order->canceled_date)->format('M d, Y') }}</small>
                                                    </div>
                                                @endif
                                            @else
                                                <span class="badge bg-warning">Ordered</span>
                                            @endif
                                        </td>
                                        <td class="text-center">
                                            <div class="date-info">
                                                <div>{{ \Carbon\Carbon::parse($order->created_at)->format('M d, Y') }}</div>
                                                <small class="text-muted">{{ \Carbon\Carbon::parse($order->created_at)->format('h:i A') }}</small>
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <div class="tracking-info">
                                                @if($order->status == 'ordered')
                                                    <div class="tracking-step active">
                                                        <i class="icon-check-circle text-success"></i>
                                                        <span>Order Placed</span>
                                                    </div>
                                                    <div class="tracking-step">
                                                        <i class="icon-clock text-muted"></i>
                                                        <span>Processing</span>
                                                    </div>
                                                    <div class="tracking-step">
                                                        <i class="icon-truck text-muted"></i>
                                                        <span>Shipped</span>
                                                    </div>
                                                    <div class="tracking-step">
                                                        <i class="icon-home text-muted"></i>
                                                        <span>Delivered</span>
                                                    </div>
                                                @elseif($order->status == 'shipped')
                                                    <div class="tracking-step completed">
                                                        <i class="icon-check-circle text-success"></i>
                                                        <span>Order Placed</span>
                                                    </div>
                                                    <div class="tracking-step completed">
                                                        <i class="icon-check-circle text-success"></i>
                                                        <span>Processing</span>
                                                    </div>
                                                    <div class="tracking-step active">
                                                        <i class="icon-truck text-primary"></i>
                                                        <span>Shipped</span>
                                                    </div>
                                                    <div class="tracking-step">
                                                        <i class="icon-home text-muted"></i>
                                                        <span>Delivered</span>
                                                    </div>
                                                @elseif($order->status == 'delivered')
                                                    <div class="tracking-step completed">
                                                        <i class="icon-check-circle text-success"></i>
                                                        <span>Order Placed</span>
                                                    </div>
                                                    <div class="tracking-step completed">
                                                        <i class="icon-check-circle text-success"></i>
                                                        <span>Processing</span>
                                                    </div>
                                                    <div class="tracking-step completed">
                                                        <i class="icon-check-circle text-success"></i>
                                                        <span>Shipped</span>
                                                    </div>
                                                    <div class="tracking-step completed">
                                                        <i class="icon-home text-success"></i>
                                                        <span>Delivered</span>
                                                    </div>
                                                @elseif($order->status == 'canceled')
                                                    <div class="tracking-step completed">
                                                        <i class="icon-check-circle text-success"></i>
                                                        <span>Order Placed</span>
                                                    </div>
                                                    <div class="tracking-step canceled">
                                                        <i class="icon-x-circle text-danger"></i>
                                                        <span>Canceled</span>
                                                    </div>
                                                @endif
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <div class="action-buttons">
                                                <a href="{{ route('admin.order.items', ['order_id' => $order->id]) }}"
                                                   class="btn btn-sm btn-outline-primary" title="View Details">
                                                    <i class="icon-eye"></i>
                                                </a>
                                                @if($order->status != 'delivered' && $order->status != 'canceled')
                                                    <button type="button" class="btn btn-sm btn-outline-success"
                                                            onclick="updateStatus({{ $order->id }})" title="Update Status">
                                                        <i class="icon-edit"></i>
                                                    </button>
                                                @endif
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="9" class="text-center py-4">
                                            <div class="empty-state">
                                                <i class="icon-package text-muted" style="font-size: 3rem;"></i>
                                                <h5 class="mt-3">No Orders Found</h5>
                                                <p class="text-muted">No orders match your search criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="divider"></div>
                <div class="flex items-center justify-between flex-wrap gap10 wgp-pagination">
                    <div class="pagination-info">
                        Showing {{ $orders->firstItem() ?? 0 }} to {{ $orders->lastItem() ?? 0 }} of {{ $orders->total() }} orders
                    </div>
                    {{ $orders->links('pagination::bootstrap-5') }}
                </div>
            </div>
        </div>
    </div>

    <!-- Status Update Modal -->
    <div class="modal fade" id="statusModal" tabindex="-1" aria-labelledby="statusModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="statusModalLabel">Update Order Status</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="statusForm" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="order_status" class="form-label">Order Status</label>
                            <select class="form-select" id="order_status" name="order_status" required>
                                <option value="ordered">Ordered</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Status</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <style>
        .tracking-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .tracking-step {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.8rem;
        }

        .tracking-step.completed {
            color: #28a745;
        }

        .tracking-step.active {
            color: #007bff;
            font-weight: bold;
        }

        .tracking-step.canceled {
            color: #dc3545;
        }

        .action-buttons {
            display: flex;
            gap: 5px;
            justify-content: center;
        }

        .customer-info, .contact-info, .items-info, .amount-info, .date-info {
            text-align: center;
        }

        .empty-state {
            text-align: center;
            padding: 2rem;
        }

        .pagination-info {
            font-size: 0.9rem;
            color: #6c757d;
        }
    </style>

    <script>
        function updateStatus(orderId) {
            const form = document.getElementById('statusForm');
            form.action = `/admin/order/${orderId}/update-status`;

            const modal = new bootstrap.Modal(document.getElementById('statusModal'));
            modal.show();
        }

        // Auto-submit filter form when status changes
        document.querySelector('select[name="status_filter"]').addEventListener('change', function() {
            document.getElementById('filter-form').submit();
        });
    </script>
@endsection
