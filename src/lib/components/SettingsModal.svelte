<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Check, Settings2 } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import Separator from './ui/separator/separator.svelte';
	import type { Themes } from '$lib/types';
	import { MediaQuery } from 'runed';

	let {
		colorTheme = $bindable(),
		themes,
		shapeTheme = $bindable()
	}: { colorTheme: keyof typeof themes; themes: Themes; shapeTheme: string } = $props();

	// Utility to determine if a theme is selected
	const isSelected = (key: string, current: string) => key === current;

	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#snippet content()}
	<div class="mx-auto max-w-md p-4">
		<div class="mb-6 grid grid-cols-4 gap-4">
			{#each Object.entries(themes) as [themeKey, colors]}
				<button
					class={`relative grid h-16 w-16 cursor-pointer grid-cols-2 grid-rows-2 rounded-lg shadow-lg transition-all duration-300`}
					onclick={() => (colorTheme = themeKey)}
					aria-label={`Theme ${themeKey}`}
					title={`Select theme ${themeKey}`}
				>
					<div
						class="row-span-2 h-full w-full rounded-bl-lg rounded-tl-lg"
						style={`background-color: ${colors.hour}`}
					></div>
					<div
						class="h-full w-full rounded-tr-lg"
						style={`background-color: ${colors.minute}`}
					></div>
					<div class="h-full w-full rounded-br-lg" style={`background-color: ${colors.both}`}></div>

					{#if isSelected(themeKey, colorTheme)}
						<div
							class="absolute inset-0 flex items-center justify-center text-white"
							aria-hidden="true"
						>
							<Check strokeWidth={3} />
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<Separator class="my-4" />

		<div class="grid grid-cols-3 gap-4">
			<!-- Rounded -->
			<button
				class={`relative flex h-16 w-16 items-center justify-center rounded-lg shadow-lg transition-all duration-300 `}
				style={`background-color: ${themes[colorTheme].hour}`}
				onclick={() => (shapeTheme = 'rounded')}
				aria-label="Rounded Shape"
				title="Select Rounded Shape"
			>
				{#if isSelected('rounded', shapeTheme)}
					<Check strokeWidth={3} />
				{/if}
			</button>

			<!-- Square -->
			<button
				class={`relative flex h-16 w-16 items-center justify-center shadow-lg transition-all duration-300`}
				style={`background-color: ${themes[colorTheme].minute}`}
				onclick={() => (shapeTheme = 'square')}
				aria-label="Square Shape"
				title="Select Square Shape"
			>
				{#if isSelected('square', shapeTheme)}
					<Check strokeWidth={3} />
				{/if}
			</button>

			<!-- Circle -->
			<button
				class={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300`}
				style={`background-color: ${themes[colorTheme].both}`}
				onclick={() => (shapeTheme = 'circle')}
				aria-label="Circle Shape"
				title="Select Circle Shape"
			>
				{#if isSelected('circle', shapeTheme)}
					<Check strokeWidth={3} />
				{/if}
			</button>
		</div>
	</div>
{/snippet}

{#if isDesktop.matches}
	<Dialog.Root bind:open>
		<Dialog.Trigger>
			<Button variant="ghost" size="icon" aria-label="Open instellingen">
				<Settings2 class="h-5 w-5" />
			</Button>
		</Dialog.Trigger>

		<Dialog.Content>
			<Dialog.Header>
				<h3 class="mb-4 text-lg font-semibold">Instellingen</h3>
			</Dialog.Header>
			{@render content()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			<Button variant="ghost" size="icon" aria-label="Open Settings">
				<Settings2 class="h-5 w-5" />
			</Button>
		</Drawer.Trigger>

		<Drawer.Content class="mb-4">
			<Drawer.Header>
				<h3 class="mb-4 text-lg font-semibold">Instellingen</h3>
			</Drawer.Header>
			{@render content()}
		</Drawer.Content>
	</Drawer.Root>
{/if}
