<script lang="ts">
    import { auth } from "$lib/stores";
    import { updateProfile } from "$lib/api.remote";
    import { _ } from "$lib/i18n";

    let name = $state($auth.user?.name || "");
    let email = $state($auth.user?.email || "");
    let phone = $state($auth.user?.phone || "");
    let message = $state("");
    let success = $state(false);
    let loading = $state(false);

    async function handleSave() {
        loading = true;
        message = "";
        success = false;

        try {
            const result = await updateProfile({ name, email, phone });
            success = result.success;
            message =
                result.message ||
                (success
                    ? $_("profile.updateSuccess")
                    : $_("profile.updateError"));

            if (success) {
                auth.updateUser({ name, email, phone });
            }
        } catch (error) {
            success = false;
            message = $_("profile.updateError");
            console.error(error);
        } finally {
            loading = false;
        }
    }
</script>

<div class="profile-page">
    <h1>{$_("profile.title")}</h1>
    <p class="subtitle">{$_("profile.personalInfo")}</p>

    <div class="profile-card">
        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}
            class="profile-form"
        >
            <div class="form-grid">
                <div class="form-group">
                    <label for="name">{$_("profile.name")}</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={name}
                        disabled={loading}
                    />
                </div>

                <div class="form-group">
                    <label for="email">{$_("profile.email")}</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={email}
                        disabled={loading}
                    />
                </div>

                <div class="form-group">
                    <label for="phone">{$_("profile.phone")}</label>
                    <input
                        type="tel"
                        id="phone"
                        bind:value={phone}
                        disabled={loading}
                    />
                </div>

                <div class="form-group">
                    <label for="role">{$_("profile.role")}</label>
                    <input
                        type="text"
                        id="role"
                        value={$auth.user?.role || ""}
                        disabled
                    />
                </div>
            </div>

            {#if message}
                <div class="message" class:success class:error={!success}>
                    {message}
                </div>
            {/if}

            <div class="form-actions">
                <button type="submit" class="primary-btn" disabled={loading}>
                    {loading ? $_("common.loading") : $_("profile.saveChanges")}
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    .profile-page {
        max-width: 800px;
    }

    h1 {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--color-text-main);
    }

    .subtitle {
        color: var(--color-text-muted);
        margin-bottom: 2rem;
    }

    .profile-card {
        background: var(--color-bg-card);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 2rem;
    }

    .profile-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--color-text-main);
    }

    input {
        padding: 0.75rem;
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        background: var(--color-bg-lighter);
        color: var(--color-text-main);
        font-size: 0.95rem;
        transition: border-color 0.2s;
    }

    input:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .message {
        padding: 1rem;
        border-radius: var(--radius-sm);
        font-size: 0.9rem;
    }

    .message.success {
        background: hsl(150, 60%, 95%);
        color: hsl(150, 60%, 30%);
        border: 1px solid hsl(150, 60%, 70%);
    }

    [data-theme="dark"] .message.success {
        background: hsla(150, 60%, 30%, 0.2);
        color: hsl(150, 60%, 70%);
        border: 1px solid hsla(150, 60%, 50%, 0.3);
    }

    .message.error {
        background: hsl(0, 70%, 95%);
        color: hsl(0, 70%, 40%);
        border: 1px solid hsl(0, 70%, 70%);
    }

    [data-theme="dark"] .message.error {
        background: hsla(0, 70%, 40%, 0.2);
        color: hsl(0, 70%, 70%);
        border: 1px solid hsla(0, 70%, 50%, 0.3);
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1rem;
    }

    .primary-btn {
        padding: 0.75rem 2rem;
        background: linear-gradient(
            135deg,
            var(--color-primary-dark),
            var(--color-primary)
        );
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .primary-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .primary-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
</style>
