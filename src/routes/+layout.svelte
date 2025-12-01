<script lang="ts">
	import { initI18n } from "$lib/i18n";
	import { theme } from "$lib/stores";
	import { onMount } from "svelte";
	import "$lib/styles/themes.css";

	let { children } = $props();

	// Initialize i18n
	initI18n();

	// Initialize theme on mount
	onMount(() => {
		theme.initialize();
	});
</script>

<svelte:head></svelte:head>

{@render children()}
