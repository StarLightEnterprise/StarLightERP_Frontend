<script lang="ts">
    import { locale } from "$lib/i18n";
    import { availableLanguages, setLanguage } from "$lib/i18n";
    import { _ } from "$lib/i18n";

    let showMenu = $state(false);
    const currentLocale = $derived($locale || "en");
    const currentLanguage = $derived(
        availableLanguages.find((lang) => lang.code === currentLocale) ||
            availableLanguages[0],
    );

    function toggleMenu() {
        showMenu = !showMenu;
    }

    function selectLanguage(langCode: string) {
        setLanguage(langCode);
        showMenu = false;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".language-selector-container")) {
            showMenu = false;
        }
    }

    $effect(() => {
        if (showMenu) {
            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }
    });
</script>

<div class="language-selector-container">
    <button
        class="language-button"
        onclick={toggleMenu}
        type="button"
        aria-label="Select language"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path
                d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            ></path>
        </svg>
        <span class="language-code">{currentLanguage.code.toUpperCase()}</span>
    </button>

    {#if showMenu}
        <div class="dropdown-menu">
            <div class="menu-header">{$_("settings.selectLanguage")}</div>
            {#each availableLanguages as lang}
                <button
                    onclick={() => selectLanguage(lang.code)}
                    class="menu-item"
                    class:active={currentLocale === lang.code}
                    type="button"
                >
                    <span class="lang-native">{lang.nativeName}</span>
                    <span class="lang-name">{lang.name}</span>
                    {#if currentLocale === lang.code}
                        <svg
                            class="check-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
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
    {/if}
</div>

<style>
    .language-selector-container {
        position: relative;
    }

    .language-button {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        height: 40px;
        padding: 0 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--color-text-main);
        font-weight: 500;
        font-size: 0.85rem;
    }

    .language-button:hover {
        background: var(--glass-border);
        transform: scale(1.02);
    }

    .language-code {
        font-weight: 600;
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: var(--color-bg-card);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        box-shadow: var(--glass-shadow);
        min-width: 220px;
        padding: 0.5rem 0;
        z-index: 100;
        animation: slideDown 0.2s ease-out;
        max-height: 400px;
        overflow-y: auto;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .menu-header {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .menu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        color: var(--color-text-main);
        transition: background 0.2s;
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        gap: 0.75rem;
    }

    .menu-item:hover {
        background: var(--glass-bg);
    }

    .menu-item.active {
        background: var(--glass-bg);
        color: var(--color-primary);
    }

    .lang-native {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .lang-name {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        flex: 1;
    }

    .check-icon {
        color: var(--color-primary);
        flex-shrink: 0;
    }
</style>
