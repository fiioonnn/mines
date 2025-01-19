<script>
	import { click } from '$lib/assets';
	import { Howl } from 'howler';

	let clickSound = new Howl({ src: click });
	let { selected = $bindable(), disabled } = $props();
</script>

<div class="grid grid-cols-4 rounded-lg overflow-hidden">
	{@render button(1)}
	{@render button(3)}
	{@render button(5)}
	{@render button(7)}
	{@render button(10)}
	{@render button(15)}
	{@render button(20)}
	{@render button(24)}
</div>

{#snippet button(amount)}
	<button
		{disabled}
		class={[
			'bg-zinc-700 flex-1 p-1 text-sm disabled:opacity-50',
			{
				'!bg-zinc-600': selected === amount
			}
		]}
		onclick={() => {
			selected = amount;
			clickSound.play();
		}}>{amount}</button
	>
{/snippet}
