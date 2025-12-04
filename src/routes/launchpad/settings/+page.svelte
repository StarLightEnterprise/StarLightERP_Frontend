<script lang="ts">
    import { theme, breadcrumbs } from "$lib/stores";
    import { locale } from "$lib/i18n";
    import { availableLanguages, setLanguage } from "$lib/i18n";
    import { _ } from "$lib/i18n";
    import { resetPassword } from "$lib/api.remote";
    import { onMount } from "svelte";

    // Set breadcrumb on mount
    onMount(() => {
        breadcrumbs.set([{ label: "Settings", href: "/launchpad/settings" }]);
    });

    const currentTheme = $derived($theme);
    const currentLocale = $derived($locale || "en");

    let currentPassword = $state("");
    let newPassword = $state("");
    let confirmPassword = $state("");
    let passwordMessage = $state("");
    let passwordSuccess = $state(false);
    let passwordLoading = $state(false);

    function handleThemeChange(newTheme: "light" | "dark") {
        theme.setTheme(newTheme);
    }

    function handleLanguageChange(langCode: string) {
        setLanguage(langCode);
    }

    async function handlePasswordReset(e: Event) {
        e.preventDefault();
        passwordLoading = true;
        passwordMessage = "";
        passwordSuccess = false;

        if (newPassword !== confirmPassword) {
            passwordMessage = $_("auth.passwordsDoNotMatch");
            passwordLoading = false;
            return;
        }

        if (newPassword.length < 8) {
            passwordMessage = $_("auth.passwordHint");
            passwordLoading = false;
            return;
        }

        try {
            const result = await resetPassword({
                currentPassword,
                newPassword,
            });
            passwordSuccess = result.success;
            passwordMessage =
                result.message ||
                (result.success
                    ? $_("password.resetSuccess")
                    : $_("password.resetError"));

            if (passwordSuccess) {
                currentPassword = "";
                newPassword = "";
                confirmPassword = "";
            }
        } catch (error) {
            passwordSuccess = false;
            passwordMessage = $_("password.resetError");
            console.error(error);
        } finally {
            passwordLoading = false;
        }
    }
</script>

<div class="settings-page">
    <h1>{$_("settings.title")}</h1>
    <p class="subtitle">{$_("settings.preferences")}</p>

    <!-- Theme Settings -->
    <div class="settings-card">
        <h2>{$_("settings.theme")}</h2>
        <div class="theme-options">
            <button
                class="theme-option"
                class:active={currentTheme === "light"}
                onclick={() => handleThemeChange("light")}
                type="button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span>{$_("settings.light")}</span>
            </button>
            <button
                class="theme-option"
                class:active={currentTheme === "dark"}
                onclick={() => handleThemeChange("dark")}
                type="button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    ></path>
                </svg>
                <span>{$_("settings.dark")}</span>
            </button>
        </div>
    </div>

    <!-- Language Settings -->
    <div class="settings-card">
        <h2>{$_("settings.language")}</h2>
        <div class="language-options">
            {#each availableLanguages as lang}
                <button
                    class="language-option"
                    class:active={currentLocale === lang.code}
                    onclick={() => handleLanguageChange(lang.code)}
                    type="button"
                >
                    <span class="lang-native">{lang.nativeName}</span>
                    <span class="lang-name">{lang.name}</span>
                    {#if currentLocale === lang.code}
                        <svg
                            class="check-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    {/if}
                </button>
            {/each}
        </div>
    </div>

    <!-- Password Reset -->
    <div class="settings-card">
        <h2>{$_("password.resetPassword")}</h2>
        <form onsubmit={handlePasswordReset} class="password-form">
            <div class="form-group">
                <label for="current-password"
                    >{$_("password.currentPassword")}</label
                >
                <input
                    type="password"
                    id="current-password"
                    bind:value={currentPassword}
                    disabled={passwordLoading}
                    required
                />
            </div>

            <div class="form-group">
                <label for="new-password">{$_("password.newPassword")}</label>
                <input
                    type="password"
                    id="new-password"
                    bind:value={newPassword}
                    disabled={passwordLoading}
                    required
                />
            </div>

            <div class="form-group">
                <label for="confirm-password"
                    >{$_("password.confirmNewPassword")}</label
                >
                <input
                    type="password"
                    id="confirm-password"
                    bind:value={confirmPassword}
                    disabled={passwordLoading}
                    required
                />
            </div>

            {#if passwordMessage}
                <div
                    class="message"
                    class:success={passwordSuccess}
                    class:error={!passwordSuccess}
                >
                    {passwordMessage}
                </div>
            {/if}

            <button
                type="submit"
                class="primary-btn"
                disabled={passwordLoading}
            >
                {passwordLoading ? $_("common.loading") : $_("password.update")}
            </button>
        </form>
    </div>
</div>

<style>
    .settings-page {
        max-width: 800px;
    }

    h1 {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--color-text-main);
    }

    h2 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-main);
    }

    .subtitle {
        color: var(--color-text-muted);
        margin-bottom: 2rem;
    }

    .settings-card {
        background: var(--color-bg-card);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 2rem;
        margin-bottom: 1.5rem;
    }

    .theme-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }

    .theme-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.5rem 1rem;
        background: var(--color-bg-lighter);
        border: 2px solid var(--glass-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.2s;
        color: var(--color-text-main);
        font-weight: 500;
    }

    .theme-option:hover {
        border-color: var(--color-primary);
        transform: translateY(-2px);
    }

    .theme-option.active {
        border-color: var(--color-primary);
        background: var(--glass-bg);
        color: var(--color-primary);
    }

    .language-options {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.75rem;
    }

    .language-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--color-bg-lighter);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.2s;
        color: var(--color-text-main);
        text-align: left;
    }

    .language-option:hover {
        border-color: var(--color-primary);
        background: var(--glass-bg);
    }

    .language-option.active {
        border-color: var(--color-primary);
        background: var(--glass-bg);
    }

    .lang-native {
        font-weight: 600;
        flex: 1;
    }

    .lang-name {
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }

    .check-icon {
        color: var(--color-primary);
        flex-shrink: 0;
    }

    .password-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        max-width: 400px;
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
        align-self: flex-start;
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
