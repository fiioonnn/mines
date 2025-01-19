<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-screen flex flex-col justify-center items-center">
	{@render children()}
</div>
