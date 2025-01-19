<script>
	let { amount = 0, multiplier = 0, label = 'Profit' } = $props();
</script>

<div class="space-y-2">
	<p>{label}:</p>
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
		<span class="text-xs text-zinc-400">({multiplier}x)</span>
	</p>
</div>
