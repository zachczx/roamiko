<script lang="ts">
	let { children } = $props();
</script>

<main class="grid min-h-dvh content-center justify-items-center gap-8">
	<div class="font-logo text-primary text-9xl font-extrabold tracking-tighter">
		<a href="/">Roamichi</a>
	</div>
	<section class="grid w-full max-w-6xl content-center justify-items-center gap-8 rounded-lg p-4">
		{@render children()}
	</section>
</main>
