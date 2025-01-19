<script>
	let { amount = 0 } = $props();
</script>

<div class="space-y-2">
	<p>Balance:</p>
	<p
		class={[
			'p-2.5 bg-zinc-700 rounded-lg text-center',
			{
				'text-green-500': amount > 0,
				'text-red-500': amount < 0
			}
		]}
	>
		{(Math.floor(amount * 100) / 100).toFixed(2)}
	</p>
</div>
