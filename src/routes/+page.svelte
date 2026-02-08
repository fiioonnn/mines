<script>
	import { Howl } from 'howler';
	import Icon from '@iconify/svelte';
	import Tile from '$lib/components/Tile.svelte';
	import Balance from '$lib/components/Balance.svelte';
	import MinesSelector from '$lib/components/MinesSelector.svelte';
	import Bet from '$lib/components/Bet.svelte';
	import { onMount } from 'svelte';
	import Profit from '$lib/components/Profit.svelte';
	import { mine, tile, click, collect as collectSound } from '$lib/assets';
	import { base } from '$app/paths';

	let { data } = $props();

	let minesCount = $state(1);
	let bet = $state(0.1);
	let balance = $state(0);
	let gameState = $state('idle');
	let tiles = $state([]);
	let gameSession = $state(null);
	let tilesSelected = $state([]);
	let multiplier = $state(0);
	let nextMultiplier = $state(0);
	let sounds = {
		mine: new Howl({ src: mine }),
		tile: new Howl({ src: tile, volume: 0.5 }),
		click: new Howl({ src: click }),
		collect: new Howl({ src: collectSound })
	};

	onMount(() => {
		console.log({ data });
		balance = data?.user.balance || 0;
		gameSession = data?.gameSession || null;
		bet = gameSession?.bet || 0.1;
		minesCount = gameSession?.mines || 3;
		multiplier = data?.multiplier || 0;
		nextMultiplier = data?.nextMultiplier || 0;
		tilesSelected = JSON.parse(gameSession?.tiles_selected || '[]');
		tiles = parseTiles(gameSession?.tiles);
	});

	const start = async () => {
		const response = await fetch('/api/start', {
			method: 'POST',
			body: JSON.stringify({ mines: minesCount, bet })
		});

		if (!response.ok) {
			return console.error('Failed to start game');
		}

		const data = await response.json();

		if (data.error) {
			return console.error(data.message);
		}
		sounds.click.play();
		multiplier = data.multiplier;
		nextMultiplier = data.nextMultiplier;
		gameSession = data.gameSession;
		balance = data.newBalance;
		tilesSelected = [];
		tiles = parseTiles(gameSession?.tiles);
	};

	const reveal = async (index) => {
		const response = await fetch('/api/reveal', {
			method: 'POST',
			body: JSON.stringify({ index })
		});

		if (!response.ok) {
			return console.error('Failed to reveal tile');
		}

		const data = await response.json();

		if (data.error) {
			return console.error(data.message);
		}

		if (!data.gameSession?.in_progress) {
			sounds.mine.play();
		} else {
			sounds.tile.play();
		}

		tiles = data.tiles;
		gameSession = data.gameSession;
		tilesSelected = JSON.parse(gameSession?.tiles_selected);
		multiplier = data.multiplier;
		nextMultiplier = data.nextMultiplier;
		balance = balance + data.profit;
	};

	const collect = async () => {
		const response = await fetch('/api/collect');

		if (!response.ok) {
			return console.error('Failed to reveal tile');
		}

		const data = await response.json();

		if (data.error) {
			return console.error(data.message);
		}

		sounds.collect.play();
		tiles = [];
		gameSession = null;
		tilesSelected = [];
		multiplier = 0;
		nextMultiplier = 0;
		balance = balance + data.profit;
	};

	const pickRandom = () => {
		const availableTiles = tiles.reduce((acc, tile, index) => {
			if (!tile.revealed) acc.push(index);
			return acc;
		}, []);
		if (availableTiles.length === 0) return;
		const randomIndex = availableTiles[Math.floor(Math.random() * availableTiles.length)];
		reveal(randomIndex);
	};

	const parseTiles = (tiles) => {
		try {
			return JSON.parse(tiles);
		} catch {
			return [];
		}
	};
</script>

<div class="space-y-5">
	<div class="flex flex-col items-center relative">
		<Icon icon="noto:bomb" class="size-20 absolute -top-5 -z-10" />
		<h1 class="text-7xl font-bold uppercase tracking-widest text-center shadow-md">Mines</h1>
		<p class="text-zinc-500">Casino's are scam</p>
	</div>
	<div class="grid grid-cols-[2fr,5fr] gap-5">
		<div class="max-w-lg w-full rounded-2xl p-5 bg-zinc-800 flex flex-col gap-3">
			<div class="space-y-2">
				<p>Mines:</p>
				<MinesSelector bind:selected={minesCount} disabled={gameSession?.in_progress} />
			</div>
			<div class="space-y-2">
				<p>Bet:</p>
				<Bet bind:bet disabled={gameSession?.in_progress} />
			</div>
			<div class="space-y-2">
				<Balance amount={balance} />
				<a href={`${base}/login`} class="text-xs block text-zinc-400 text-right hover:opacity-50"
					>Redeem code</a
				>
			</div>
			<Profit amount={bet * multiplier} {multiplier} />
			{#if nextMultiplier}
				<Profit label="Next profit" amount={bet * nextMultiplier} multiplier={nextMultiplier} />
			{/if}
			<div class="mt-auto space-y-2.5">
				{#if gameSession?.in_progress}
					<button
						class="block p-2.5 bg-blue-600 w-full rounded-lg disabled:pointer-events-none disabled:bg-zinc-700/25 disabled:text-zinc-500"
						onclick={pickRandom}
					>
						Pick random
					</button>
				{/if}
				{#if gameSession?.in_progress && tilesSelected.length > 0}
					<button
						class="block p-2.5 bg-green-600 w-full rounded-lg disabled:pointer-events-none disabled:bg-zinc-700/25 disabled:text-zinc-500"
						onclick={collect}
					>
						Collect {(Math.floor(bet * multiplier * 100) / 100).toFixed(2)}
					</button>
				{:else}
					<button
						class="block p-2.5 bg-zinc-600 w-full rounded-lg disabled:pointer-events-none disabled:bg-zinc-700/25 disabled:text-zinc-500"
						onclick={start}
						disabled={gameSession?.in_progress}
					>
						Start
					</button>
				{/if}
			</div>
		</div>
		<div class="grid grid-cols-5 grid-rows-5 gap-3 rounded-2xl p-3 border-2 border-zinc-900">
			{#if tiles.length > 0}
				{#each tiles as { isMine, revealed }, i}
					<Tile
						{isMine}
						{revealed}
						onclick={() => reveal(i)}
						selected={tilesSelected.includes(i) && !gameSession?.in_progress}
						lowpacity={!gameSession?.in_progress}
					/>
				{/each}
			{:else}
				{#each { length: 25 }}
					<Tile disabled />
				{/each}
			{/if}
		</div>
	</div>
</div>
