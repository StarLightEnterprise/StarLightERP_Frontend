<script lang="ts">
	import { initI18n } from "$lib/i18n";
	import { theme } from "$lib/stores";
	import { onMount } from "svelte";
	import "$lib/styles/themes.css";

	let { children } = $props();

	import { isLoading } from "$lib/i18n";

	// Initialize i18n
	initI18n();

	// Initialize theme on mount
	onMount(() => {
		theme.initialize();
	});
</script>

<svelte:head></svelte:head>

{#if $isLoading}
	<div class="loading-screen">Loading...</div>
{:else}
	{@render children()}
{/if}

<style>
	.loading-screen {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		background-color: var(--color-bg);
		color: var(--color-text);
	}
</style>
