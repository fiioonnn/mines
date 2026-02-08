<script>
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Mines</title>
	<meta name="description" content="A simple minesweeper game" />
</svelte:head>

<div class="h-screen flex flex-col justify-center items-center">
	{@render children()}
</div>
