<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { X, ImagePlus } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import { MediaQuery } from 'runed';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

	let {
		open = $bindable(),
		bgSetup = $bindable()
	}: {
		open: boolean;
		bgSetup: { images: string[]; delay: number };
	} = $props();

	let newImageUrl: string = $state('');

	function addImageUrl() {
		if (!newImageUrl) return;

		// Basic URL validation
		try {
			new URL(newImageUrl);

			// Check for duplicate
			if (bgSetup.images.includes(newImageUrl)) {
				return;
			}

			bgSetup.images = [...bgSetup.images, newImageUrl];
			newImageUrl = '';
		} catch {}
	}

	function removeImage(index: number) {
		bgSetup.images = bgSetup.images.filter((_, i) => i !== index);
	}

	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

{#snippet content()}
	<div class="grid gap-4 py-4">
		<div class="grid gap-2">
			<Label>Verversingsinterval (seconden)</Label>
			<Slider bind:value={bgSetup.delay} type="single" min={1000} max={100000} step={1000} />
			<span class="text-sm text-muted-foreground">
				Huidige interval: {Math.round(bgSetup.delay / 1000)}s
			</span>
		</div>

		<div class="grid gap-2">
			<Label>Afbeeldings-URL toevoegen</Label>
			<div class="flex gap-2">
				<Input
					type="url"
					placeholder="Voer afbeeldings-URL in"
					bind:value={newImageUrl}
					class="flex-grow"
				/>
				<Button onclick={addImageUrl} size="icon" variant="outline">
					<ImagePlus class="h-4 w-4" />
				</Button>
			</div>
		</div>

		<div class="grid gap-2">
			<Label>Huidige Afbeeldingen</Label>
			<div class="max-h-40 space-y-2 overflow-y-auto">
				{#each bgSetup.images as image, i}
					<div class="flex items-center justify-between gap-2 rounded-md bg-muted p-2">
						<img src={image} alt="Achtergrond {i + 1}" class="h-8 w-8 rounded object-cover" />
						<Button variant="destructive" size="icon" onclick={() => removeImage(i)}>
							<X class="h-4 w-4" />
						</Button>
					</div>
				{:else}
					<p class="text-sm text-muted-foreground text-center">Geen afbeeldingen toegevoegd</p>
				{/each}
			</div>
		</div>
	</div>
{/snippet}

{#if isDesktop.matches}
	<Dialog.Root bind:open>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Achtergrond-instellingen</Dialog.Title>
				<Dialog.Description>
					Beheer uw achtergrondafbeeldingen en verversingsinterval
				</Dialog.Description>
			</Dialog.Header>
			{@render content()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Achtergrond-instellingen</Drawer.Title>
				<Drawer.Description>
					Beheer uw achtergrondafbeeldingen en verversingsinterval
				</Drawer.Description>
			</Drawer.Header>
			{@render content()}
		</Drawer.Content>
	</Drawer.Root>
{/if}
