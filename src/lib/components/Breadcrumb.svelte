<script lang="ts">
    import { breadcrumbs } from "$lib/stores/breadcrumb";
    import { page } from "$app/stores";
    import { _ } from "svelte-i18n";

    // Subscribe to breadcrumbs store
    // We can also derive breadcrumbs from $page.url if we wanted automatic generation
    // but explicit control via store is often more flexible for dynamic titles.
</script>

<nav aria-label="Breadcrumb" class="breadcrumb-nav">
    <ol class="breadcrumb-list">
        {#each $breadcrumbs as item, i}
            <li class="breadcrumb-separator">/</li>
            <li class="breadcrumb-item" class:active={!item.href}>
                {#if item.href}
                    <a href={item.href}>{item.label}</a>
                {:else}
                    <span aria-current="page">{item.label}</span>
                {/if}
            </li>
        {/each}
    </ol>
</nav>

<style>
    .breadcrumb-nav {
        padding: 0.5rem 0;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }

    .breadcrumb-list {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin: 0;
        align-items: center;
    }

    .breadcrumb-item a {
        color: var(--primary-color, #007bff);
        text-decoration: none;
    }

    .breadcrumb-item a:hover {
        text-decoration: underline;
    }

    .breadcrumb-item.active span {
        color: var(--text-color-secondary, #6c757d);
    }

    .breadcrumb-separator {
        margin: 0 0.5rem;
        color: var(--text-color-muted, #adb5bd);
    }
</style>
