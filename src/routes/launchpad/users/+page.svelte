<script lang="ts">
    import { onMount } from "svelte";
    import { breadcrumbs, auth } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { _ } from "$lib/i18n";
    import { BACKEND_URL } from "$lib/config";

    let users = $state<any[]>([]);
    let loading = $state(false);
    let error = $state("");
    let showCreateForm = $state(false);
    let showEditForm = $state(false);
    let showResetPasswordModal = $state(false);
    let editingUser = $state<any>(null);
    let resetPasswordUserId = $state<number | null>(null);

    // Create form fields
    let createUsername = $state("");
    let createEmail = $state("");
    let createPassword = $state("");
    let createName = $state("");
    let createRole = $state("User");

    // Edit form fields
    let editUsername = $state("");
    let editEmail = $state("");
    let editName = $state("");
    let editRole = $state("User");
    let editIsActive = $state(true);

    // Reset password fields
    let resetPassword = $state("");
    let generatedPassword = $state("");
    let showPassword = $state(false);

    onMount(async () => {
        // Check if user is super admin
        const authState = $auth;
        if (!authState.user?.is_super_admin) {
            goto("/launchpad");
            return;
        }

        breadcrumbs.set([{ label: "Users", href: "/launchpad/users" }]);
        await loadUsers();
    });

    async function loadUsers() {
        loading = true;
        error = "";

        try {
            const response = await fetch(`${BACKEND_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${$auth.accessToken}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                users = data.users || [];
            } else {
                error = data.message || "Failed to load users";
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function createUser() {
        if (!createUsername || !createEmail || !createPassword) {
            error = "All fields are required";
            return;
        }

        loading = true;
        error = "";

        try {
            const response = await fetch(`${BACKEND_URL}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${$auth.accessToken}`,
                },
                body: JSON.stringify({
                    username: createUsername,
                    email: createEmail,
                    password: createPassword,
                    name: createName,
                    role: createRole,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Reset form
                createUsername = "";
                createEmail = "";
                createPassword = "";
                createName = "";
                createRole = "User";
                showCreateForm = false;
                await loadUsers();
            } else {
                error = data.message || "Failed to create user";
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function openEditForm(user: any) {
        editingUser = user;
        editUsername = user.username;
        editEmail = user.email;
        editName = user.name || "";
        editRole = user.role;
        editIsActive = user.is_active;
        showEditForm = true;
        showCreateForm = false;
        error = "";
    }

    async function updateUser() {
        if (!editingUser || !editUsername || !editEmail) {
            error = "Username and email are required";
            return;
        }

        loading = true;
        error = "";

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/users/${editingUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${$auth.accessToken}`,
                    },
                    body: JSON.stringify({
                        username: editUsername,
                        email: editEmail,
                        name: editName,
                        role: editRole,
                        is_active: editIsActive,
                    }),
                },
            );

            const data = await response.json();

            if (data.success) {
                showEditForm = false;
                editingUser = null;
                await loadUsers();
            } else {
                error = data.message || "Failed to update user";
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function cancelEdit() {
        showEditForm = false;
        editingUser = null;
        error = "";
    }

    function openResetPasswordModal(userId: number) {
        resetPasswordUserId = userId;
        resetPassword = "";
        generatedPassword = "";
        showPassword = false;
        showResetPasswordModal = true;
        error = "";
    }

    function generateSecurePassword() {
        // Generate a secure random password
        const length = 12;
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const special = "!@#$%^&*";

        let password = "";
        // Ensure at least one of each required character type
        password += upperCase[Math.floor(Math.random() * upperCase.length)];
        password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }

        // Shuffle the password
        password = password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        resetPassword = password;
        generatedPassword = password;
        showPassword = true;
    }

    async function resetUserPassword() {
        if (!resetPassword || !resetPasswordUserId) {
            error = "Password is required";
            return;
        }

        loading = true;
        error = "";

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/users/${resetPasswordUserId}/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${$auth.accessToken}`,
                    },
                    body: JSON.stringify({ password: resetPassword }),
                },
            );

            const data = await response.json();

            if (data.success) {
                // Keep the modal open to show the generated password
                if (!generatedPassword) {
                    showResetPasswordModal = false;
                    resetPasswordUserId = null;
                }
                // Show success message but keep password visible if generated
            } else {
                error = data.message || "Failed to reset password";
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function closeResetPasswordModal() {
        showResetPasswordModal = false;
        resetPasswordUserId = null;
        resetPassword = "";
        generatedPassword = "";
        showPassword = false;
        error = "";
    }

    async function deleteUser(userId: number) {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        loading = true;
        error = "";

        try {
            const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${$auth.accessToken}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                await loadUsers();
            } else {
                error = data.message || "Failed to delete user";
            }
        } catch (err) {
            error = "Network error occurred";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }
</script>

<div class="users-container">
    <div class="header">
        <h1>User Management</h1>
        <button
            class="btn-primary"
            onclick={() => {
                showCreateForm = !showCreateForm;
                showEditForm = false;
                error = "";
            }}
        >
            {showCreateForm ? "Cancel" : "+ Create User"}
        </button>
    </div>

    {#if error}
        <div class="error-message">{error}</div>
    {/if}

    {#if showCreateForm}
        <div class="create-form">
            <h2>Create New User</h2>
            <div class="form-grid">
                <div class="form-group">
                    <label for="create-username">Username *</label>
                    <input
                        type="text"
                        id="create-username"
                        bind:value={createUsername}
                        placeholder="Enter username"
                    />
                </div>
                <div class="form-group">
                    <label for="create-email">Email *</label>
                    <input
                        type="email"
                        id="create-email"
                        bind:value={createEmail}
                        placeholder="Enter email"
                    />
                </div>
                <div class="form-group">
                    <label for="create-password">Password *</label>
                    <input
                        type="password"
                        id="create-password"
                        bind:value={createPassword}
                        placeholder="Enter password"
                    />
                </div>
                <div class="form-group">
                    <label for="create-name">Name</label>
                    <input
                        type="text"
                        id="create-name"
                        bind:value={createName}
                        placeholder="Enter full name"
                    />
                </div>
                <div class="form-group">
                    <label for="create-role">Role</label>
                    <select id="create-role" bind:value={createRole}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
            </div>
            <button class="btn-primary" onclick={createUser} disabled={loading}>
                {loading ? "Creating..." : "Create User"}
            </button>
        </div>
    {/if}

    {#if showEditForm && editingUser}
        <div class="edit-form">
            <h2>Edit User: {editingUser.username}</h2>
            <div class="form-grid">
                <div class="form-group">
                    <label for="edit-username">Username *</label>
                    <input
                        type="text"
                        id="edit-username"
                        bind:value={editUsername}
                        placeholder="Enter username"
                    />
                </div>
                <div class="form-group">
                    <label for="edit-email">Email *</label>
                    <input
                        type="email"
                        id="edit-email"
                        bind:value={editEmail}
                        placeholder="Enter email"
                    />
                </div>
                <div class="form-group">
                    <label for="edit-name">Name</label>
                    <input
                        type="text"
                        id="edit-name"
                        bind:value={editName}
                        placeholder="Enter full name"
                    />
                </div>
                <div class="form-group">
                    <label for="edit-role">Role</label>
                    <select id="edit-role" bind:value={editRole}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-active">Status</label>
                    <div class="toggle-container">
                        <label class="toggle">
                            <input
                                type="checkbox"
                                id="edit-active"
                                bind:checked={editIsActive}
                            />
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="toggle-label">
                            {editIsActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <button
                    class="btn-primary"
                    onclick={updateUser}
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update User"}
                </button>
                <button class="btn-secondary" onclick={cancelEdit}>
                    Cancel
                </button>
            </div>
        </div>
    {/if}

    {#if loading && users.length === 0}
        <div class="loading">Loading users...</div>
    {:else}
        <div class="users-table">
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.name || "-"}</td>
                            <td>
                                <span class="badge">{user.role}</span>
                            </td>
                            <td>
                                <span
                                    class="status {user.is_active
                                        ? 'active'
                                        : 'inactive'}"
                                >
                                    {user.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button
                                        class="btn-edit"
                                        onclick={() => openEditForm(user)}
                                        disabled={loading}
                                        title="Edit user"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        class="btn-reset"
                                        onclick={() =>
                                            openResetPasswordModal(user.id)}
                                        disabled={loading}
                                        title="Reset password"
                                    >
                                        Reset Pwd
                                    </button>
                                    <button
                                        class="btn-danger"
                                        onclick={() => deleteUser(user.id)}
                                        disabled={loading}
                                        title="Delete user"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            {#if users.length === 0}
                <div class="empty-state">No users found</div>
            {/if}
        </div>
    {/if}
</div>

{#if showResetPasswordModal}
    <div class="modal-overlay" onclick={closeResetPasswordModal}>
        <div class="modal-content" onclick={(e) => e.stopPropagation()}>
            <h2>Reset User Password</h2>

            <div class="form-group">
                <label for="reset-password">New Password *</label>
                <div class="password-input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="reset-password"
                        bind:value={resetPassword}
                        placeholder="Enter new password"
                        class="password-input"
                    />
                    <button
                        class="btn-icon"
                        onclick={() => (showPassword = !showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                </div>
            </div>

            <button class="btn-generate" onclick={generateSecurePassword}>
                🎲 Generate Secure Password
            </button>

            {#if generatedPassword}
                <div class="generated-password-box">
                    <div class="generated-label">Generated Password:</div>
                    <div class="generated-password">
                        {generatedPassword}
                        <button
                            class="btn-copy"
                            onclick={() => copyToClipboard(generatedPassword)}
                            title="Copy to clipboard"
                        >
                            📋 Copy
                        </button>
                    </div>
                    <div class="password-warning">
                        ⚠️ Make sure to copy this password. It will not be shown
                        again.
                    </div>
                </div>
            {/if}

            <div class="modal-actions">
                <button
                    class="btn-primary"
                    onclick={resetUserPassword}
                    disabled={loading || !resetPassword}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                <button class="btn-secondary" onclick={closeResetPasswordModal}>
                    {generatedPassword ? "Close" : "Cancel"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .users-container {
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
        background: #6c757d;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-secondary:hover {
        background: #5a6268;
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

    .btn-reset {
        background: #ffc107;
        color: #000;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 600;
    }

    .btn-reset:hover:not(:disabled) {
        background: #e0a800;
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

    .btn-edit:disabled,
    .btn-reset:disabled,
    .btn-danger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .action-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 1px solid #f5c6cb;
    }

    .create-form,
    .edit-form {
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

    input,
    select {
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        font-size: 0.875rem;
        transition: border-color 0.2s;
    }

    input:focus,
    select:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .toggle-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 0;
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
    }

    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 24px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    .toggle input:checked + .toggle-slider {
        background-color: #28a745;
    }

    .toggle input:checked + .toggle-slider:before {
        transform: translateX(26px);
    }

    .toggle-label {
        font-weight: 600;
        color: var(--color-text);
    }

    .users-table {
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

    .loading,
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--color-text-muted);
        font-size: 1.1rem;
    }

    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--color-bg-paper);
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .password-input-container {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .password-input {
        flex: 1;
    }

    .btn-icon {
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        padding: 0.75rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .btn-icon:hover {
        background: var(--color-border);
    }

    .btn-generate {
        background: #17a2b8;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        width: 100%;
        margin: 1rem 0;
    }

    .btn-generate:hover {
        background: #138496;
    }

    .generated-password-box {
        background: #e7f3ff;
        border: 2px solid #007bff;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
    }

    .generated-label {
        font-weight: 600;
        color: #004085;
        margin-bottom: 0.5rem;
    }

    .generated-password {
        background: white;
        padding: 0.75rem;
        border-radius: 6px;
        font-family: monospace;
        font-size: 1.1rem;
        font-weight: 600;
        color: #004085;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .btn-copy {
        background: #28a745;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        font-weight: 600;
    }

    .btn-copy:hover {
        background: #218838;
    }

    .password-warning {
        color: #856404;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
        .users-container {
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

        .users-table {
            overflow-x: auto;
        }

        table {
            min-width: 600px;
        }

        .action-buttons {
            flex-direction: column;
        }

        .modal-content {
            width: 95%;
            padding: 1.5rem;
        }

        .modal-actions {
            flex-direction: column;
        }

        .generated-password {
            flex-direction: column;
            gap: 0.5rem;
            align-items: stretch;
        }
    }
</style>
