<script lang="ts">
    import { onMount } from "svelte";
    import { breadcrumbs, auth } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { _ } from "$lib/i18n";
    import { BACKEND_URL } from "$lib/config";

    let customers = $state<any[]>([]);
    let loading = $state(false);
    let error = $state("");
    let showCreateForm = $state(false);
    let editingCustomer = $state<any>(null);

    // Form fields
    let customerName = $state("");
    let customerCategory = $state("School");
    let customerType = $state("Primary");
    let email = $state("");
    let phone = $state("");
    let isActive = $state(true);

    onMount(async () => {
        // Check if user is super admin
        const authState = $auth;
        if (!authState.user?.is_super_admin) {
            goto("/launchpad");
            return;
        }

        breadcrumbs.set([{ label: "Customers", href: "/launchpad/customers" }]);
        await loadCustomers();
    });

    async function loadCustomers() {
        loading = true;
        error = "";

        try {
            const response = await fetch(`${BACKEND_URL}/api/customers`, {
                headers: {
                    Authorization: `Bearer ${$auth.accessToken}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                customers = data.customers || [];
            } else {
                error = data.message || "Failed to load customers";
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function resetForm() {
        customerName = "";
        customerCategory = "School";
        customerType = "Primary";
        email = "";
        phone = "";
        isActive = true;
        editingCustomer = null;
    }

    function startEdit(customer: any) {
        editingCustomer = customer;
        customerName = customer.customer_name;
        customerCategory = customer.customer_category;
        customerType = customer.customer_type;
        email = customer.email;
        phone = customer.phone || "";
        isActive = customer.is_active;
        showCreateForm = true;
    }

    async function saveCustomer() {
        if (!customerName || !email) {
            error = "Customer name and email are required";
            return;
        }

        loading = true;
        error = "";

        try {
            const payload = {
                customer_name: customerName,
                customer_category: customerCategory,
                customer_type: customerType,
                email,
                phone: phone || null,
                is_active: isActive,
            };

            const url = editingCustomer
                ? `${BACKEND_URL}/api/customers/${editingCustomer.customer_id}`
                : `${BACKEND_URL}/api/customers`;

            const response = await fetch(url, {
                method: editingCustomer ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${$auth.accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                resetForm();
                showCreateForm = false;
                await loadCustomers();
            } else {
                error =
                    data.message ||
                    `Failed to ${editingCustomer ? "update" : "create"} customer`;
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function deleteCustomer(customerId: number) {
        if (!confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        loading = true;
        error = "";

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/customers/${customerId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${$auth.accessToken}`,
                    },
                },
            );

            const data = await response.json();

            if (data.success) {
                await loadCustomers();
            } else {
                error = data.message || "Failed to delete customer";
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function cancelEdit() {
        resetForm();
        showCreateForm = false;
    }
</script>

<div class="customers-container">
    <div class="header">
        <h1>Customer Management</h1>
        <button
            class="btn-primary"
            onclick={() => {
                resetForm();
                showCreateForm = !showCreateForm;
            }}
        >
            {showCreateForm ? "Cancel" : "+ Create Customer"}
        </button>
    </div>

    {#if error}
        <div class="error-message">{error}</div>
    {/if}

    {#if showCreateForm}
        <div class="create-form">
            <h2>{editingCustomer ? "Edit" : "Create"} Customer</h2>
            <div class="form-grid">
                <div class="form-group">
                    <label for="customerName">Customer Name *</label>
                    <input
                        type="text"
                        id="customerName"
                        bind:value={customerName}
                        placeholder="Enter customer name"
                    />
                </div>
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={email}
                        placeholder="Enter email"
                    />
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        bind:value={phone}
                        placeholder="Enter phone number"
                    />
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" bind:value={customerCategory}>
                        <option value="School">School</option>
                        <option value="College">College</option>
                        <option value="University">University</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="type">Type</label>
                    <select id="type" bind:value={customerType}>
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                        <option value="Higher Secondary"
                            >Higher Secondary</option
                        >
                    </select>
                </div>
                <div class="form-group">
                    <label for="isActive">
                        <input
                            type="checkbox"
                            id="isActive"
                            bind:checked={isActive}
                        />
                        Active
                    </label>
                </div>
            </div>
            <div class="form-actions">
                <button
                    class="btn-primary"
                    onclick={saveCustomer}
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : editingCustomer
                          ? "Update"
                          : "Create"} Customer
                </button>
                {#if editingCustomer}
                    <button class="btn-secondary" onclick={cancelEdit}>
                        Cancel
                    </button>
                {/if}
            </div>
        </div>
    {/if}

    {#if loading && customers.length === 0}
        <div class="loading">Loading customers...</div>
    {:else}
        <div class="customers-table">
            <table>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each customers as customer}
                        <tr>
                            <td>{customer.customer_name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone || "-"}</td>
                            <td>
                                <span class="badge"
                                    >{customer.customer_category}</span
                                >
                            </td>
                            <td>
                                <span class="badge secondary"
                                    >{customer.customer_type}</span
                                >
                            </td>
                            <td>
                                <span
                                    class="status {customer.is_active
                                        ? 'active'
                                        : 'inactive'}"
                                >
                                    {customer.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td>
                                <div class="actions">
                                    <button
                                        class="btn-edit"
                                        onclick={() => startEdit(customer)}
                                        disabled={loading}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        class="btn-danger"
                                        onclick={() =>
                                            deleteCustomer(
                                                customer.customer_id,
                                            )}
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            {#if customers.length === 0}
                <div class="empty-state">No customers found</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .customers-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    h1 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-text);
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: var(--color-text);
    }

    .btn-primary {
        background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-secondary) 100%
        );
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-secondary {
        background: var(--color-border);
        color: var(--color-text);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-secondary:hover {
        background: var(--color-text-muted);
    }

    .btn-edit {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-edit:hover:not(:disabled) {
        background: #0056b3;
    }

    .btn-edit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-danger {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-danger:hover:not(:disabled) {
        background: #c82333;
    }

    .btn-danger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 1px solid #f5c6cb;
    }

    .create-form {
        background: var(--color-bg-paper);
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        border: 1px solid var(--color-border);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
    }

    label {
        font-weight: 500;
        color: var(--color-text);
        font-size: 0.875rem;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    select {
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        font-size: 0.875rem;
        transition: border-color 0.2s;
    }

    input[type="checkbox"] {
        margin-right: 0.5rem;
    }

    input:focus,
    select:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .customers-table {
        background: var(--color-bg-paper);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--color-border);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        background: var(--color-bg);
    }

    th {
        text-align: left;
        padding: 1rem;
        font-weight: 600;
        color: var(--color-text);
        border-bottom: 2px solid var(--color-border);
    }

    td {
        padding: 1rem;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text);
    }

    tbody tr:hover {
        background: var(--color-bg);
    }

    .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        background: var(--color-primary-transparent);
        color: var(--color-primary);
    }

    .badge.secondary {
        background: rgba(108, 117, 125, 0.1);
        color: #6c757d;
    }

    .status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .status.active {
        background: #d4edda;
        color: #155724;
    }

    .status.inactive {
        background: #f8d7da;
        color: #721c24;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .loading,
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--color-text-muted);
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .customers-container {
            padding: 1rem;
        }

        .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }

        .customers-table {
            overflow-x: auto;
        }

        table {
            min-width: 800px;
        }

        .actions {
            flex-direction: column;
        }
    }
</style>
