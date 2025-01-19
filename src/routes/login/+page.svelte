<script>
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	$effect(() => {
		console.log({ form });
	});
</script>

<div class="space-y-5 max-w-sm w-full">
	<div class="flex flex-col items-center relative">
		<Icon icon="noto:bomb" class="size-20 absolute -top-5 -z-10" />
		<h1 class="text-7xl font-bold uppercase tracking-widest text-center shadow-md">Mines</h1>
		<p class="text-zinc-500">Because casino's are scam</p>
	</div>

	<form class="flex flex-col gap-5" method="POST" use:enhance>
		{#if form?.error}
			<p class="text-red-500 text-center">{form.message}</p>
		{/if}
		<input
			class="bg-zinc-800 rounded-lg p-2.5 text-center focus:outline-none placeholder:text-zinc-500"
			type="text"
			placeholder="Username"
			name="username"
		/>
		<input
			class="bg-zinc-800 rounded-lg p-2.5 text-center focus:outline-none placeholder:text-zinc-500"
			type="password"
			placeholder="***********"
			name="password"
		/>
		<button class="bg-zinc-600 rounded-lg p-2.5 text-center focus:outline-none">Login</button>
	</form>
</div>
