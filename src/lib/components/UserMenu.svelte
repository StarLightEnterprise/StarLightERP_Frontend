<script lang="ts">
    import { auth } from "$lib/stores";
    import { logout as logoutApi } from "$lib/api.remote";
    import { goto } from "$app/navigation";
    import { _ } from "$lib/i18n";

    let showMenu = $state(false);
    const user = $derived($auth.user);

    function toggleMenu() {
        showMenu = !showMenu;
    }

    async function handleLogout() {
        try {
            await logoutApi({});
            auth.logout();
            goto("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Logout locally even if server call fails
            auth.logout();
            goto("/login");
        }
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".user-menu-container")) {
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

<div class="user-menu-container">
    <button class="user-profile" onclick={toggleMenu} type="button">
        <div class="user-info">
            <span class="user-name">{user?.name || user?.username}</span>
            <span class="user-role">{user?.role}</span>
        </div>
        <div class="avatar">
            {user?.name?.[0]?.toUpperCase() ||
                user?.username?.[0]?.toUpperCase() ||
                "U"}
        </div>
    </button>

    {#if showMenu}
        <div class="dropdown-menu">
            <a href="/dashboard/profile" class="menu-item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {$_("user.profile")}
            </a>
            <a href="/dashboard/settings" class="menu-item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                    ></path>
                </svg>
                {$_("settings.title")}
            </a>
            <div class="menu-divider"></div>
            <button
                onclick={handleLogout}
                class="menu-item logout"
                type="button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                {$_("user.logout")}
            </button>
        </div>
    {/if}
</div>

<style>
    .user-menu-container {
        position: relative;
    }

    .user-profile {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        color: inherit;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary), #a855f7);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .user-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
        text-align: right;
    }

    .user-name {
        font-weight: 600;
        font-size: 0.9rem;
    }

    .user-role {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: var(--color-bg-card);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        box-shadow: var(--glass-shadow);
        min-width: 200px;
        padding: 0.5rem 0;
        z-index: 100;
        animation: slideDown 0.2s ease-out;
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

    .menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: var(--color-text-main);
        text-decoration: none;
        transition: background 0.2s;
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        font-size: 0.9rem;
    }

    .menu-item:hover {
        background: var(--glass-bg);
    }

    .menu-item.logout {
        color: var(--color-danger);
    }

    .menu-divider {
        height: 1px;
        background: var(--glass-border);
        margin: 0.5rem 0;
    }
</style>
