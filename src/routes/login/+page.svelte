<script lang="ts">
    import { login, register, selectCustomer } from "$lib/api.remote";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/stores";
    import { _ } from "$lib/i18n";

    let mode = $state<"login" | "register" | "select-customer">("login");
    let username = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let email = $state("");
    let message = $state("");
    let success = $state(false);
    let loading = $state(false);

    // Customer selection state
    let customers = $state<any[]>([]);
    let selectedCustomerId = $state<number | null>(null);

    function toggleMode() {
        mode = mode === "login" ? "register" : "login";
        message = "";
        success = false;
        customers = [];
        selectedCustomerId = null;
    }

    async function handleCustomerSelection() {
        if (!selectedCustomerId) {
            message = "Please select a customer";
            success = false;
            return;
        }

        loading = true;
        message = "";

        try {
            const result = await selectCustomer({
                username,
                customerId: selectedCustomerId,
            });

            success = result.success;
            message = result.message;

            if (success && result.accessToken && result.user) {
                auth.login(
                    {
                        username: result.user.username,
                        email: result.user.email,
                        role: result.user.role || "User",
                        name: result.user.name || result.user.username,
                        customerId: result.user.customerId,
                        customerName: result.user.customerName,
                    },
                    result.accessToken,
                );
                setTimeout(() => {
                    goto("/dashboard");
                }, 1000);
            }
        } catch (error) {
            success = false;
            message = "An error occurred during customer selection.";
            console.error(error);
        } finally {
            loading = false;
        }
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();

        if (mode === "select-customer") {
            await handleCustomerSelection();
            return;
        }

        loading = true;
        message = "";
        success = false;

        // Validation for registration
        if (mode === "register") {
            if (password !== confirmPassword) {
                message = "Passwords do not match";
                loading = false;
                return;
            }

            if (!email || !email.includes("@")) {
                message = "Valid email is required";
                loading = false;
                return;
            }
        }

        try {
            let result;
            if (mode === "login") {
                result = await login({ username, password });
            } else {
                result = await register({ username, password, email });
            }

            success = result.success;
            message = result.message;

            // Handle successful authentication
            if (success) {
                if (mode === "register") {
                    // After successful registration, auto-login with JWT
                    if (result.accessToken && result.user) {
                        auth.login(
                            {
                                username: result.user.username,
                                email: result.user.email,
                                role: result.user.role || "User",
                                name: result.user.name || result.user.username,
                                customerId: result.user.customerId,
                                customerName: result.user.customerName,
                            },
                            result.accessToken,
                        );
                        setTimeout(() => {
                            goto("/dashboard");
                        }, 1000);
                    } else {
                        // Fallback: show success message and switch to login
                        setTimeout(() => {
                            mode = "login";
                            username = "";
                            password = "";
                            confirmPassword = "";
                            email = "";
                            message = $_("auth.registrationSuccess");
                        }, 2000);
                    }
                } else {
                    // Login flow
                    if (result.requiresCustomerSelection && result.customers) {
                        // Multi-customer flow: switch to selection mode
                        customers = result.customers;
                        mode = "select-customer";
                        // Pre-select primary customer if available
                        const primary = customers.find((c) => c.isPrimary);
                        if (primary) {
                            selectedCustomerId = primary.customerId;
                        }
                    } else if (result.accessToken && result.user) {
                        // Single customer or direct login
                        auth.login(
                            {
                                username: result.user.username,
                                email: result.user.email,
                                role: result.user.role || "User",
                                name: result.user.name || result.user.username,
                                customerId: result.user.customerId,
                                customerName: result.user.customerName,
                            },
                            result.accessToken,
                        );
                        setTimeout(() => {
                            goto("/dashboard");
                        }, 1000);
                    } else {
                        // Fallback for old API response format
                        auth.login(
                            {
                                username,
                                email: result.email || email,
                                role: result.role || "User",
                                name: result.name || username,
                            },
                            result.accessToken || "",
                        );
                        setTimeout(() => {
                            goto("/dashboard");
                        }, 1000);
                    }
                }
            }
        } catch (error) {
            success = false;
            message = `An error occurred during ${mode === "login" ? "login" : "registration"}.`;
            console.error(error);
        } finally {
            loading = false;
        }
    }
</script>

<div class="page-container">
    <div class="login-card">
        <div class="logo-section">
            <img src="/logo.jpg" alt="StarLight ERP Logo" class="logo" />
            <h1 class="logo-text">
                <span class="brand">StarLight</span><span class="erp">ERP</span>
            </h1>
            <p class="mode-title">
                {#if mode === "login"}
                    Sign In
                {:else if mode === "register"}
                    Create Account
                {:else}
                    Select Customer
                {/if}
            </p>
        </div>

        <form onsubmit={handleSubmit} class="login-form">
            {#if mode === "select-customer"}
                <div class="customer-list">
                    {#each customers as customer}
                        <label
                            class="customer-card {selectedCustomerId ===
                            customer.customerId
                                ? 'selected'
                                : ''}"
                        >
                            <input
                                type="radio"
                                name="customer"
                                value={customer.customerId}
                                bind:group={selectedCustomerId}
                            />
                            <div class="customer-info">
                                <div class="customer-name">
                                    {customer.customerName}
                                </div>
                                <div class="customer-details">
                                    <span class="badge category"
                                        >{customer.customerCategory}</span
                                    >
                                    <span class="badge type"
                                        >{customer.customerType}</span
                                    >
                                    {#if customer.isPrimary}
                                        <span class="badge primary"
                                            >Primary</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        </label>
                    {/each}
                </div>
            {:else}
                <div class="form-group">
                    <label for="username"
                        >Username<span class="required">*</span></label
                    >
                    <input
                        type="text"
                        id="username"
                        bind:value={username}
                        required
                        disabled={loading}
                    />
                </div>

                {#if mode === "register"}
                    <div class="form-group">
                        <label for="email"
                            >Email<span class="required">*</span></label
                        >
                        <input
                            type="email"
                            id="email"
                            bind:value={email}
                            required
                            disabled={loading}
                            placeholder="your@email.com"
                        />
                    </div>
                {/if}

                <div class="form-group">
                    <label for="password"
                        >Password<span class="required">*</span></label
                    >
                    <input
                        type="password"
                        id="password"
                        bind:value={password}
                        required
                        disabled={loading}
                    />
                    {#if mode === "register"}
                        <small class="password-hint">
                            Must be 8+ characters with uppercase, lowercase,
                            number, and special character
                        </small>
                    {/if}
                </div>

                {#if mode === "register"}
                    <div class="form-group">
                        <label for="confirmPassword"
                            >Confirm Password<span class="required">*</span
                            ></label
                        >
                        <input
                            type="password"
                            id="confirmPassword"
                            bind:value={confirmPassword}
                            required
                            disabled={loading}
                        />
                    </div>
                {/if}
            {/if}

            {#if mode === "login"}
                <div class="help-text">
                    <span>Need sign in assistance?</span>
                    <a href="/help" class="help-link">
                        <span class="shield-icon">🛡️</span> Help Center
                    </a>
                </div>
            {/if}

            <button type="submit" class="sign-in-btn" disabled={loading}>
                {#if loading}
                    {#if mode === "login"}
                        Signing in...
                    {:else if mode === "register"}
                        Creating account...
                    {:else}
                        Selecting...
                    {/if}
                {:else if mode === "login"}
                    Sign In
                {:else if mode === "register"}
                    Create Account
                {:else}
                    Continue
                {/if}
            </button>

            {#if message}
                <div class="message {success ? 'success' : 'error'}">
                    {message}
                </div>
            {/if}

            {#if mode !== "select-customer"}
                <div class="mode-toggle">
                    <button
                        type="button"
                        class="toggle-btn"
                        onclick={toggleMode}
                        disabled={loading}
                    >
                        {mode === "login"
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Sign In"}
                    </button>
                </div>
            {/if}
        </form>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: "72", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; /* "72" is SAP's font, fallback to system */
        background-color: #f0f2f5;
    }

    .page-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            135deg,
            #1a4d6d 0%,
            #1a7a8a 30%,
            #2ba3b4 100%
        );
        padding: 20px;
    }

    .login-card {
        background: white;
        border-radius: 6px; /* Slightly tighter radius */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Softer shadow */
        padding: 48px 40px; /* More padding */
        width: 100%;
        max-width: 440px; /* Slightly wider */
        border: 1px solid #d9d9d9; /* Subtle border */
    }

    .logo-section {
        text-align: center;
        margin-bottom: 40px;
    }

    .mode-title {
        margin-top: 16px;
        margin-bottom: 0;
        font-size: 18px;
        font-weight: 600;
        color: #32363a;
    }

    .logo {
        width: 120px;
        height: 120px;
        margin: 0 auto 20px;
        display: block;
        border-radius: 16px;
    }

    .logo-text {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: linear-gradient(
            135deg,
            #1a4d6d 0%,
            #1a7a8a 50%,
            #2ba3b4 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 24px; /* Increased gap */
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    label {
        font-size: 14px;
        font-weight: 400;
        color: #6a6d70; /* Muted label color */
    }

    .required {
        color: #b00; /* Darker red for required asterisk */
        margin-left: 4px;
        font-size: 16px;
        line-height: 1;
    }

    .password-hint {
        color: #6a6d70;
        font-size: 12px;
        margin-top: 4px;
        line-height: 1.4;
    }

    input {
        padding: 10px 12px;
        border: 1px solid #89919a; /* Darker border */
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.2s;
        background: white;
        height: 40px; /* Fixed height */
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #2ba3b4;
        box-shadow: 0 0 0 2px rgba(43, 163, 180, 0.2); /* Focus ring with teal */
    }

    input:disabled {
        background: #f2f2f2;
        color: #6a6d70;
        cursor: not-allowed;
        border-color: #ccc;
    }

    .help-text {
        display: flex;
        align-items: center;
        justify-content: space-between; /* Spread out */
        font-size: 14px;
        color: #32363a;
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .help-link {
        color: #2ba3b4;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
    }

    .help-link:hover {
        text-decoration: underline;
        color: #1a7a8a;
    }

    .shield-icon {
        font-size: 16px;
    }

    .sign-in-btn {
        padding: 0 16px;
        background: linear-gradient(135deg, #1a7a8a 0%, #2ba3b4 100%);
        color: white;
        border: 2px solid #d4a64f;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        height: 44px;
        width: 100%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .sign-in-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #2ba3b4 0%, #1a7a8a 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .sign-in-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .message {
        padding: 12px;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .message.success {
        background: #f1fdf6;
        color: #1f7a44;
        border: 1px solid #ccebd7;
    }

    .message.error {
        background: #fbecec;
        color: #bb0000;
        border: 1px solid #f5c2c7;
    }

    .mode-toggle {
        text-align: center;
        margin-top: 12px;
    }

    .toggle-btn {
        background: none;
        border: none;
        color: #2ba3b4;
        font-size: 14px;
        cursor: pointer;
        padding: 8px;
        text-decoration: underline;
        transition: color 0.2s;
    }

    .toggle-btn:hover:not(:disabled) {
        color: #1a7a8a;
    }

    .toggle-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Customer Selection Styles */
    .customer-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 300px;
        overflow-y: auto;
    }

    .customer-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .customer-card:hover {
        border-color: #2ba3b4;
        background-color: #f0f8fa;
    }

    .customer-card.selected {
        border-color: #1a7a8a;
        background-color: #e6f2f5;
        box-shadow: 0 0 0 1px #1a7a8a;
    }

    .customer-card input[type="radio"] {
        margin: 0;
        height: 16px;
        width: 16px;
    }

    .customer-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .customer-name {
        font-weight: 600;
        color: #32363a;
    }

    .customer-details {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
    }

    .badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .badge.category {
        background-color: #e8f0fe;
        color: #1967d2;
    }

    .badge.type {
        background-color: #fce8e6;
        color: #c5221f;
    }

    .badge.primary {
        background-color: #e6f4ea;
        color: #137333;
    }
</style>
