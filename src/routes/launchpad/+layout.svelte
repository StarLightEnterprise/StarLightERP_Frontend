<script lang="ts">
    import "./styles.css";
    import { page } from "$app/stores";
    import { auth, breadcrumbs } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { _ } from "$lib/i18n";
    import UserMenu from "$lib/components/UserMenu.svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import LanguageSelector from "$lib/components/LanguageSelector.svelte";
    import Breadcrumb from "$lib/components/Breadcrumb.svelte";
    import { BACKEND_URL } from "$lib/config";

    let { children } = $props();

    type App = { app_id: string; description: string; is_admin_app: boolean };

    let apps = $state<App[]>([]);
    let loading = $state<boolean>(true);
    let error = $state<string | null>(null);
    let isSuperUser = $state<boolean>(false);

    // Map app_id to route - now using sub-routes of launchpad
    const appRoutes: Record<string, string> = {
        A000001: "/launchpad/users",
        A000002: "/launchpad/customers",
    };

    // Map app_id to icon SVG
    const appIcons: Record<string, string> = {
        A000001: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>`,
        A000002: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>`,
    };

    // Fetch apps from backend
    async function fetchApps() {
        try {
            loading = true;
            error = null;

            const token = $auth.accessToken;
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${BACKEND_URL}/api/apps`, {
                method: "GET",
                headers,
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch apps: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                apps = data.apps || [];
                isSuperUser = data.is_super_user || false;
            } else {
                error = data.message || "Failed to load apps";
            }
        } catch (err) {
            console.error("Error fetching apps:", err);
            error = "Unable to load apps. Please try again later.";
        } finally {
            loading = false;
        }
    }

    // Launch app by navigating
    function launchApp(appId: string, description: string) {
        const route = appRoutes[appId];
        if (route) {
            // Navigate to the app route
            goto(route);
        }
    }

    // Check if we're on a child route (app is open)
    let isAppOpen = $derived($page.url.pathname !== "/launchpad");

    // Check authentication on mount
    onMount(() => {
        if (!$auth.isAuthenticated) {
            goto("/login");
            return;
        }

        if (!isAppOpen) {
            breadcrumbs.clear();
        }
        fetchApps();
    });
</script>

<div class="launchpad-container">
    <main class="main-content">
        <header class="top-bar">
            <div class="brand-breadcrumb-area">
                <button class="brand-area" onclick={() => goto("/launchpad")}>
                    <img src="/logo.jpg" alt="StarLightERP Logo" class="logo" />
                    <span class="brand-text"
                        >StarLight<span class="brand-highlight">ERP</span></span
                    >
                </button>
                <Breadcrumb />
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
            <div class="launchpad-page-container">
                <!-- Show tiles section only when no app is open -->
                {#if !isAppOpen}
                    <div class="launchpad-tiles-section">
                        <div class="welcome-section">
                            <h1>
                                {$_("launchpad.welcome", {
                                    default: "Welcome back, Upendra!",
                                })}
                            </h1>
                            <p class="subtitle-center">
                                {$_("launchpad.subtitle", {
                                    default: "Your personal workspace",
                                })}
                            </p>
                        </div>

                        <div class="apps-grid-container">
                            {#if loading}
                                <div class="loading-state">
                                    <p>Loading apps...</p>
                                </div>
                            {:else if error}
                                <div class="error-state">
                                    <p>{error}</p>
                                </div>
                            {:else if apps.length === 0}
                                <div class="empty-state">
                                    <p>
                                        No apps available. Contact your
                                        administrator.
                                    </p>
                                </div>
                            {:else}
                                <div class="apps-grid">
                                    {#each apps as app (app.app_id)}
                                        <button
                                            class="app-tile"
                                            onclick={() =>
                                                launchApp(
                                                    app.app_id,
                                                    app.description,
                                                )}
                                        >
                                            <div class="icon-wrapper">
                                                {@html appIcons[app.app_id] ||
                                                    appIcons["A000001"]}
                                            </div>
                                            <span class="label"
                                                >{app.description}</span
                                            >
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}

                <!-- App content area (child routes) -->
                {#if isAppOpen}
                    <div class="app-content-section">
                        {@render children?.()}
                    </div>
                {/if}
            </div>
        </div>
    </main>
</div>

<style>
    .launchpad-container {
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
        padding: 0; /* Removed padding to allow full width */
        width: 100%;
    }

    .brand-breadcrumb-area {
        display: flex;
        align-items: center;
        gap: 0;
    }

    .brand-area {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 1rem;
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 8px;
    }

    .brand-area:hover {
        background-color: var(--color-bg);
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

    /* New Layout Styles */
    .launchpad-page-container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        width: 100%;
    }

    .launchpad-tiles-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
        transition: all 0.5s ease;
        padding: 2rem;
    }

    .app-content-section {
        flex: 1;
        background-color: var(--color-bg);
        animation: fadeIn 0.5s ease;
        overflow-y: auto;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .welcome-section {
        margin-bottom: 4rem;
    }

    .welcome-section h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-secondary) 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .welcome-section p {
        font-size: 1.1rem;
        color: var(--color-text-muted);
    }

    .subtitle-center {
        text-align: center;
    }

    .apps-grid-container {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .apps-grid {
        display: flex;
        gap: 2rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    .app-tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        background: var(--color-bg-paper);
        border: 2px solid var(--color-border);
        border-radius: 20px;
        padding: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--color-text);
        min-width: 150px;
    }

    .app-tile:hover {
        transform: translateY(-5px);
        border-color: var(--color-primary);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .app-tile .icon-wrapper {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-secondary) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: all 0.3s;
    }

    .app-tile:hover .icon-wrapper {
        transform: scale(1.1);
    }

    .app-tile .label {
        font-weight: 600;
        font-size: 1rem;
        color: var(--color-text);
    }

    .empty-state,
    .loading-state,
    .error-state {
        text-align: center;
        color: var(--color-text-muted);
        padding: 2rem;
        font-size: 1.1rem;
    }

    .error-state {
        color: #e74c3c;
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

        .brand-breadcrumb-area {
            gap: 0;
        }

        .brand-area {
            padding: 0.5rem;
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

        .launchpad-tiles-section {
            min-height: 50vh;
            padding: 1rem;
        }

        .welcome-section h1 {
            font-size: 1.75rem;
        }

        .welcome-section p {
            font-size: 1rem;
        }

        .welcome-section {
            margin-bottom: 2rem;
        }

        .apps-grid {
            gap: 1.5rem;
            flex-direction: column;
            align-items: stretch;
        }

        .app-tile .icon-wrapper {
            width: 60px;
            height: 60px;
        }

        .app-tile {
            flex-direction: row;
            justify-content: flex-start;
            padding: 1rem;
            gap: 1rem;
            min-width: unset;
            width: 100%;
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
            padding: 0.5rem;
        }

        .header-actions {
            padding: 0 0.5rem;
        }

        .welcome-section h1 {
            font-size: 1.5rem;
        }

        .launchpad-tiles-section {
            padding: 0.5rem;
        }
    }
</style>
