<script lang="ts">
    import "./styles.css";
    import { page } from "$app/stores";
    import { auth } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { _ } from "$lib/i18n";
    import UserMenu from "$lib/components/UserMenu.svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import LanguageSelector from "$lib/components/LanguageSelector.svelte";

    let { children } = $props();

    // Check authentication on mount
    onMount(() => {
        if (!$auth.isAuthenticated) {
            goto("/login");
        }
    });

    const navItems = [
        {
            name: "nav.dashboard",
            href: "/dashboard",
            icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
        },
        {
            name: "nav.students",
            href: "/dashboard/students",
            icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
        },
        {
            name: "nav.teachers",
            href: "/dashboard/teachers",
            icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
        },
        {
            name: "nav.classes",
            href: "/dashboard/classes",
            icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
        },
        {
            name: "nav.schedule",
            href: "/dashboard/schedule",
            icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
        },
        {
            name: "nav.settings",
            href: "/dashboard/settings",
            icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
        },
    ];
</script>

<div class="dashboard-container">
    <main class="main-content">
        <header class="top-bar">
            <div class="brand-area">
                <img src="/logo.jpg" alt="StarLightERP Logo" class="logo" />
                <span class="brand-text"
                    >StarLight<span class="brand-highlight">ERP</span></span
                >
            </div>

            <div class="search-bar">
                <svg
                    class="search-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="11" cy="11" r="8"></circle><line
                        x1="21"
                        y1="21"
                        x2="16.65"
                        y2="16.65"
                    ></line></svg
                >
                <input
                    type="text"
                    class="search-input"
                    placeholder={$_("common.search")}
                />
            </div>

            <div class="header-actions">
                <ThemeToggle />
                <LanguageSelector />
                <UserMenu />
            </div>
        </header>

        <div class="content-area">
            {@render children()}
        </div>
    </main>
</div>

<style>
    .dashboard-container {
        min-height: 100vh;
        background-color: var(--color-bg);
        width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .main-content {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        box-sizing: border-box;
    }

    .top-bar {
        height: 64px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--color-bg-paper);
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        z-index: 10;
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    .search-bar {
        position: relative;
        width: 400px;
        max-width: 400px;
        flex-shrink: 1;
    }

    .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-muted);
        width: 1.25rem;
        height: 1.25rem;
    }

    .search-input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 3rem;
        border-radius: 9999px;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        color: var(--color-text);
        font-size: 0.875rem;
        transition: all 0.2s;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-transparent);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .content-area {
        flex: 1;
        padding: 2rem;
        width: 100%;
    }

    .brand-area {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0 1rem;
    }

    .logo {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        object-fit: cover;
    }

    .brand-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text);
        letter-spacing: -0.5px;
    }

    .brand-highlight {
        color: var(--color-primary);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0 1rem;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
        .top-bar {
            height: 56px;
        }

        .search-bar {
            width: 200px;
            max-width: 200px;
        }

        .brand-area {
            padding: 0 0.5rem;
        }

        .brand-text {
            font-size: 1rem;
        }

        .logo {
            width: 32px;
            height: 32px;
        }

        .header-actions {
            gap: 0.5rem;
            padding: 0 0.5rem;
        }

        .content-area {
            padding: 1rem;
        }
    }

    @media (max-width: 480px) {
        .search-bar {
            width: 120px;
            max-width: 120px;
        }

        .brand-text {
            display: none; /* Hide brand text on very small screens */
        }

        .brand-area {
            padding: 0 0.5rem;
        }

        .header-actions {
            padding: 0 0.5rem;
        }
    }
</style>
