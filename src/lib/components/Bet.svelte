<script>
	import { click } from '$lib/assets';
	import { Howl } from 'howler';

	let clickSound = new Howl({ src: click });
	let { bet = $bindable(0), disabled } = $props();

	let betIndex = $state(0);
	let bets = $state([
		0.01, 0.05, 0.1, 0.2, 0.4, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000
	]);

	const increase = () => {
		if (betIndex < bets.length - 1) {
			clickSound.play();
			betIndex += 1;
			bet = bets[betIndex];
		}
	};

	const decrease = () => {
		if (betIndex > 0) {
			clickSound.play();
			betIndex -= 1;
			bet = bets[betIndex];
		}
	};
</script>

<div class="flex justify-between items-center">
	<button
		class="size-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:pointer-events-none disabled:opacity-50"
		onclick={decrease}
		{disabled}>-</button
	>
	<p>{bet.toFixed(2)}</p>
	<button
		class="size-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:pointer-events-none disabled:opacity-50"
		onclick={increase}
		{disabled}>+</button
	>
</div>
