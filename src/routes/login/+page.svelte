<script lang="ts">
    import { login } from "$lib/api.remote";

    let username = $state("");
    let password = $state("");
    let message = $state("");
    let success = $state(false);
    let loading = $state(false);

    async function handleSubmit(event: Event) {
        event.preventDefault();
        loading = true;
        message = "";

        try {
            const result = await login({ username, password });
            success = result.success;
            message = result.message;
        } catch (error) {
            success = false;
            message = "An error occurred during login.";
            console.error(error);
        } finally {
            loading = false;
        }
    }
</script>

<div class="page-container">
    <div class="login-card">
        <div class="logo-section">
            <h1 class="logo-text">
                <span class="brand">StarLight</span><span class="erp">ERP</span>
                <span class="star">⭐</span>
            </h1>
        </div>

        <form onsubmit={handleSubmit} class="login-form">
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
            </div>

            <div class="help-text">
                <span>Need sign in assistance?</span>
                <a href="/help" class="help-link">
                    <span class="shield-icon">🛡️</span> Help Center
                </a>
            </div>

            <button type="submit" class="sign-in-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
            </button>

            {#if message}
                <div class="message {success ? 'success' : 'error'}">
                    {message}
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
        background: #eff1f2; /* Light gray background */
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

    .logo-text {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: #0070d2;
    }

    .brand {
        color: #008fd3; /* Lighter blue for brand */
    }

    .erp {
        color: #008fd3;
    }

    .star {
        font-size: 28px;
        color: #f0ab00;
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
        border-color: #0070d2;
        box-shadow: 0 0 0 2px rgba(0, 112, 210, 0.2); /* Focus ring */
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
        color: #0070d2;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
    }

    .help-link:hover {
        text-decoration: underline;
        color: #005fb8;
    }

    .shield-icon {
        font-size: 16px;
    }

    .sign-in-btn {
        padding: 0 16px;
        background-color: #0a6ed1; /* SAP Blue */
        color: white;
        border: none;
        border-radius: 8px; /* Slightly rounded */
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.2s;
        height: 44px; /* Taller button */
        width: 100%;
    }

    .sign-in-btn:hover:not(:disabled) {
        background-color: #0854a0;
    }

    .sign-in-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #0a6ed1;
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
</style>
