<script lang="ts">
    import { breadcrumbs, type Breadcrumb } from "$lib/stores";
    import { goto } from "$app/navigation";

    let crumbs = $state<Breadcrumb[]>([]);

    $effect(() => {
        const unsubscribe = breadcrumbs.subscribe((value) => {
            crumbs = value;
        });
        return unsubscribe;
    });

    function navigate(href: string) {
        goto(href);
    }
</script>

{#if crumbs.length > 0}
    <nav class="breadcrumb-nav">
        {#each crumbs as crumb, index}
            {#if index > 0}
                <svg
                    class="separator"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            {/if}
            <button
                class="breadcrumb-item"
                class:active={index === crumbs.length - 1}
                onclick={() => navigate(crumb.href)}
            >
                {crumb.label}
            </button>
        {/each}
    </nav>
{/if}

<style>
    .breadcrumb-nav {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 1rem;
    }

    .separator {
        color: var(--color-text-muted);
        flex-shrink: 0;
    }

    .breadcrumb-item {
        background: none;
        border: none;
        color: var(--color-text);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .breadcrumb-item:hover {
        background-color: var(--color-bg);
        color: var(--color-primary);
    }

    .breadcrumb-item.active {
        color: var(--color-primary);
        cursor: default;
    }

    .breadcrumb-item.active:hover {
        background-color: transparent;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .breadcrumb-nav {
            padding: 0 0.5rem;
            gap: 0.25rem;
        }

        .breadcrumb-item {
            font-size: 0.75rem;
            padding: 0.25rem;
        }

        .separator {
            width: 12px;
            height: 12px;
        }
    }
</style>
