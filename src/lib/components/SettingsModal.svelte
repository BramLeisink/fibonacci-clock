<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import {
		Check,
		ImageOff,
		Lightbulb,
		LightbulbOff,
		Settings2,
		Timer,
		TimerOff,
		Vibrate,
		VibrateOff,
		Image,
		X
	} from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import Separator from './ui/separator/separator.svelte';
	import type { Themes } from '$lib/types';
	import { MediaQuery } from 'runed';

	import { Switch } from '$lib/components/ui/switch';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';
	import BgModal from './BgModal.svelte';

	let {
		colorTheme = $bindable(),
		themes,
		shapeTheme = $bindable(),
		glow = $bindable(),
		animate = $bindable(),
		showMinutes = $bindable(),
		bgSetup = $bindable()
	}: {
		colorTheme: keyof typeof themes;
		themes: Themes;
		shapeTheme: string;
		glow: boolean;
		animate: boolean;
		showMinutes: boolean;
		bgSetup: { images: any[]; delay: number };
	} = $props();

	let newImageUrl: string = $state('');
	let fileInput: HTMLInputElement | null = $state(null);

	function addImageUrl() {
		if (newImageUrl) {
			bgSetup.images = [...bgSetup.images, newImageUrl];
			newImageUrl = '';
		}
	}

	function removeImage(index: number) {
		bgSetup.images = bgSetup.images.filter((_, i) => i !== index);
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target && target.files) {
			const file = target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target) {
						bgSetup.images = [...bgSetup.images, (e.target as FileReader).result];
					}
				};
				reader.readAsDataURL(file);
			}
		}
	}

	// Utility to determine if a theme is selected
	const isSelected = (key: string, current: string) => key === current;

	let open = $state(false);
	let bgDialogOpen = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#snippet content()}
	<div class="mx-auto flex max-w-md flex-col items-center p-4">
		<div class="grid grid-cols-4 gap-4">
			{#each Object.entries(themes) as [themeKey, colors]}
				<button
					class={`relative grid h-16 w-16 cursor-pointer grid-cols-2 grid-rows-2 rounded-lg shadow-lg transition-all duration-300`}
					onclick={() => (colorTheme = themeKey)}
					aria-label={`Theme ${themeKey}`}
					title={`Select theme ${themeKey}`}
					style={`filter: ${isSelected(themeKey, colorTheme) ? 'none' : 'grayscale(20%) brightness(50%)'};`}
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

		<Separator class="my-6" />

		<div class="grid grid-cols-3 gap-4">
			<!-- Rounded -->
			<button
				class={`relative flex h-16 w-16 items-center justify-center rounded-lg shadow-lg transition-all duration-300 `}
				style={`background-color: ${themes[colorTheme].hour}; filter: ${isSelected('rounded', shapeTheme) ? 'none' : 'grayscale(20%) brightness(50%)'};`}
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
				style={`background-color: ${themes[colorTheme].minute}; filter: ${isSelected('square', shapeTheme) ? 'none' : 'grayscale(20%) brightness(50%)'};`}
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
				style={`background-color: ${themes[colorTheme].both}; filter: ${isSelected('circle', shapeTheme) ? 'none' : 'grayscale(20%) brightness(50%)'};`}
				onclick={() => (shapeTheme = 'circle')}
				aria-label="Circle Shape"
				title="Select Circle Shape"
			>
				{#if isSelected('circle', shapeTheme)}
					<Check strokeWidth={3} />
				{/if}
			</button>
		</div>

		<Separator class="my-6" />

		<div class="grid grid-cols-4 gap-4">
			<!-- Rounded -->
			<button
				class={`animate-all relative flex h-16 w-16 items-center justify-center rounded-lg border bg-muted shadow-lg transition-all duration-300 `}
				style={`filter: ${glow == true ? 'none' : 'grayscale(20%) brightness(50%)'};`}
				onclick={() => (glow = !glow)}
				aria-label="Gloei"
				title="Schakel gloei"
			>
				{#if glow == true}
					<Lightbulb />
				{:else}
					<LightbulbOff />
				{/if}
			</button>
			<button
				class={`animate-all relative flex h-16 w-16 items-center justify-center rounded-lg border bg-muted shadow-lg transition-all duration-300 `}
				style={`filter: ${animate == true ? 'none' : 'grayscale(20%) brightness(50%)'};`}
				onclick={() => (animate = !animate)}
				aria-label="Animaties"
				title="Schakel animaties"
			>
				{#if animate == true}
					<Vibrate />
				{:else}
					<VibrateOff />
				{/if}
			</button>
			<button
				class={`animate-all relative flex h-16 w-16 items-center justify-center rounded-lg border bg-muted shadow-lg transition-all duration-300 `}
				style={`filter: ${showMinutes == true ? 'none' : 'grayscale(20%) brightness(50%)'};`}
				onclick={() => (showMinutes = !showMinutes)}
				aria-label="Wissel minuten"
				title="Wissel minuten"
			>
				{#if showMinutes == true}
					<Timer />
				{:else}
					<TimerOff />
				{/if}
			</button>
			<button
				class={`animate-all relative flex h-16 w-16 items-center justify-center rounded-lg border bg-muted shadow-lg transition-all duration-300 `}
				style={`filter: ${bgSetup.images.length > 0 ? 'none' : 'grayscale(20%) brightness(50%)'};`}
				onclick={() => (bgDialogOpen = !bgDialogOpen)}
				aria-label="Wissel minuten"
				title="Wissel minuten"
			>
				{#if bgSetup.images.length > 0}
					<Image />
				{:else}
					<ImageOff />
				{/if}
			</button>
		</div>
	</div>
	<div class="w-full py-2 text-center text-muted-foreground">
		<p class="text-sm">© 2025 Bram Leisink</p>
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
			<Button variant="ghost" size="icon" aria-label="Open instellingen">
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

<BgModal bind:open={bgDialogOpen} bind:bgSetup />
