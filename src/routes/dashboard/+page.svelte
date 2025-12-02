<script>
    import { _ } from "$lib/i18n";
    import { breadcrumbs } from "$lib/stores";
    import { onMount } from "svelte";

    let isEditing = false;

    // Clear breadcrumbs on main dashboard
    onMount(() => {
        breadcrumbs.clear();
    });

    function toggleEdit() {
        isEditing = !isEditing;
    }
</script>

<div class="launchpad-container">
    <div class="welcome-section">
        <h1>
            {$_("dashboard.welcome", { default: "Welcome back, Upendra!" })}
        </h1>
        <p class="subtitle-center">
            {$_("dashboard.subtitle", { default: "Your personal workspace" })}
        </p>
    </div>

    <div class="apps-grid-container">
        <div class="apps-grid">
            <!-- Add App Button -->
            <button class="add-app-btn" onclick={toggleEdit}>
                <div class="icon-wrapper">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
                <span class="label">Add App</span>
            </button>

            <!-- Add Widget Button -->
            <button class="add-app-btn" onclick={toggleEdit}>
                <div class="icon-wrapper">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"
                        ></rect>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                </div>
                <span class="label">Add Widget</span>
            </button>
        </div>
    </div>
</div>

<style>
    .launchpad-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
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
    }

    .add-app-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        transition: transform 0.2s;
        color: var(--color-text);
    }

    .add-app-btn:hover {
        transform: translateY(-5px);
    }

    .add-app-btn .icon-wrapper {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background-color: var(--color-bg-paper);
        border: 2px dashed var(--color-border);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
        transition: all 0.2s;
    }

    .add-app-btn:hover .icon-wrapper {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background-color: var(--color-primary-transparent);
    }

    .add-app-btn .label {
        font-weight: 500;
        font-size: 0.9rem;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
        .launchpad-container {
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

        .add-app-btn .icon-wrapper {
            width: 60px;
            height: 60px;
        }

        .add-app-btn {
            flex-direction: row;
            justify-content: flex-start;
            padding: 1rem;
            gap: 1rem;
        }
    }

    @media (max-width: 480px) {
        .welcome-section h1 {
            font-size: 1.5rem;
        }

        .launchpad-container {
            padding: 0.5rem;
        }
    }
</style>
