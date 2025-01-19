<script>
	import Icon from '@iconify/svelte';
	let { revealed, isMine, onclick, disabled, selected, lowpacity } = $props();
</script>

<button
	{disabled}
	class={[
		'size-28 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all grid place-content-center border-2 border-transparent active:scale-105 ',
		{ '!bg-green-600 border-green-400 pointer-events-none': revealed && !isMine },
		{ '!bg-red-600 border-red-400 pointer-events-none': revealed && isMine },
		{ '!pointer-events-none opacity-75': disabled },
		{ '!opacity-100': selected },
		{ 'opacity-30': lowpacity }
	]}
	{onclick}
>
	{#if isMine && revealed}
		<Icon icon="emojione-monotone:bomb" class="size-10 text-red-300" />
	{:else if revealed}
		<Icon icon="vaadin:diamond" class="size-10 text-green-300" />
	{/if}
</button>
