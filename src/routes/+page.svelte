<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import Legend from '$lib/components/Legend.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import Block from '$lib/components/Block.svelte';

	import { mode, setMode } from 'mode-watcher';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import type { Themes, Blocks } from '$lib/types.ts';
	import { Info, Maximize2, Minimize2 } from 'lucide-svelte';

	// Define default values
	const DEFAULT_VALUES = {
		colors: 'default' as keyof typeof themes,
		shape: 'rounded' as 'circle' | 'rounded' | 'square',
		glow: false,
		animate: true,
		minutes: true,
		legend: false,
		fullscreen: false,
		mode: 'light' as 'light' | 'dark',
		bg: ''
	};

	let loading = $state(true);

	let time = $state(new Date());
	let showLegend = $state(DEFAULT_VALUES.legend);
	let isFullscreen = $state(DEFAULT_VALUES.fullscreen);
	let colorTheme: keyof typeof themes = $state(DEFAULT_VALUES.colors);
	let shapeTheme: 'circle' | 'rounded' | 'square' = $state(DEFAULT_VALUES.shape);
	let glow = $state(DEFAULT_VALUES.glow);
	let animate = $state(DEFAULT_VALUES.animate);
	let showMinutes = $state(DEFAULT_VALUES.minutes);
	let background = $state(DEFAULT_VALUES.bg);

	const themes: Themes = {
		default: { hour: '#ef4444', minute: '#22c55e', both: '#3b82f6' },
		sunrise: { hour: '#F5B041', minute: '#E74C3C', both: '#5B2C6F' },
		ocean: { hour: '#9EE2C7', minute: '#25A9B2', both: '#E48080' },
		forrest: { hour: '#044330', minute: '#E2B046', both: '#AE3638' }
	};

	// Function to parse URL parameters
	function parseURLParams() {
		const searchParams = $page.url.searchParams;

		// Handle colors parameter
		const colorsParam = searchParams.get('colors');
		if (colorsParam && colorsParam in themes) {
			colorTheme = colorsParam as keyof typeof themes;
		}

		// Handle shape parameter
		const shapeParam = searchParams.get('shape');
		if (shapeParam && ['circle', 'rounded', 'square'].includes(shapeParam)) {
			shapeTheme = shapeParam as 'circle' | 'rounded' | 'square';
		}

		// Handle boolean parameters
		const boolParams = {
			glow: { state: glow, setter: (value: boolean) => (glow = value) },
			animate: { state: animate, setter: (value: boolean) => (animate = value) },
			minutes: { state: showMinutes, setter: (value: boolean) => (showMinutes = value) },
			legend: { state: showLegend, setter: (value: boolean) => (showLegend = value) },
			fullscreen: { state: isFullscreen, setter: (value: boolean) => (isFullscreen = value) }
		};

		Object.entries(boolParams).forEach(([param, { setter }]) => {
			const value = searchParams.get(param);
			if (value === 'true' || value === 'false') {
				setter(value === 'true');
			}
		});

		const modeParam = searchParams.get('mode');
		if (modeParam === 'light' || modeParam === 'dark') {
			setMode(modeParam);
		}

		const bgParam = searchParams.get('bg');
		if (bgParam) {
			background = bgParam;
		}

		if (isFullscreen && document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}
	}

	// Update URL when settings change
	function updateURL() {
		if (!browser) return;

		const url = new URL(window.location.href);
		const currentParams = url.searchParams;

		// Helper function to update parameter only if it differs from default
		const updateParam = (name: string, value: string | boolean) => {
			if (value !== DEFAULT_VALUES[name as keyof typeof DEFAULT_VALUES]) {
				currentParams.set(name, String(value));
			} else {
				currentParams.delete(name);
			}
		};

		updateParam('colors', colorTheme);
		updateParam('shape', shapeTheme);
		updateParam('glow', glow);
		updateParam('animate', animate);
		updateParam('minutes', showMinutes);
		updateParam('legend', showLegend);
		updateParam('fullscreen', isFullscreen);
		updateParam('bg', background);

		if ($mode == 'dark') {
			currentParams.set('mode', 'dark');
		} else if ($mode == 'light') {
			currentParams.set('mode', 'light');
		} else {
			currentParams.delete('mode');
		}

		const newUrl = currentParams.toString()
			? `${window.location.pathname}?${currentParams.toString()}`
			: window.location.pathname;
		window.history.replaceState({}, '', newUrl);
	}

	$effect(() => {
		parseURLParams();
	});

	$effect(() => {
		updateURL();
	});

	async function toggleFullscreen() {
		if (!document.fullscreenElement) {
			await document.documentElement.requestFullscreen();
			isFullscreen = true;
		} else {
			await document.exitFullscreen();
			isFullscreen = false;
		}
	}

	onMount(() => {
		document.addEventListener('fullscreenchange', () => {
			isFullscreen = !!document.fullscreenElement;
		});

		blocks = [
			{ size: 5, value: 5, pos: [4, 1] },
			{ size: 3, value: 3, pos: [1, 3] },
			{ size: 2, value: 2, pos: [1, 1] },
			{ size: 1, value: 1, pos: [3, 1] },
			{ size: 1, value: 1, pos: [3, 2] }
		];

		subBlocks = [
			{ size: 1, value: 0.25, pos: [2, 1] },
			{ size: 1, value: 0.25, pos: [2, 2] },
			{ size: 1, value: 0.25, pos: [1, 2] },
			{ size: 1, value: 0.25, pos: [1, 1] }
		];

		loading = false;
	});

	let blocks = $state([]) as Blocks;
	let subBlocks = $state([]) as Blocks;
	let gridClicked = $state(false);

	// Function to handle the block colors
	function getBlockColors() {
		const colors = themes[colorTheme];
		let hours = time.getHours() % 12 || 12;
		let minutes = Math.floor(time.getMinutes() / 5);

		let bestSolution: {
			colors: (string | null)[];
			unusedHours: number;
			unusedMinutes: number;
		} | null = null;

		function tryConfiguration(configuration: boolean[][]) {
			let hourSum = 0;
			let minuteSum = 0;

			blocks.forEach((block, index) => {
				if (configuration[0][index]) hourSum += block.value;
				if (configuration[1][index]) minuteSum += block.value;
			});

			return {
				unusedHours: Math.abs(hours - hourSum),
				unusedMinutes: Math.abs(minutes - minuteSum),
				colors: blocks.map((_, index) => {
					if (configuration[0][index] && configuration[1][index]) return colors.both;
					if (configuration[0][index]) return colors.hour;
					if (configuration[1][index]) return colors.minute;
					return null;
				})
			};
		}

		// Loop to find the best configuration for the blocks
		for (let i = 0; i < Math.pow(2, blocks.length); i++) {
			for (let j = 0; j < Math.pow(2, blocks.length); j++) {
				const hourConfig = Array.from({ length: blocks.length }, (_, idx) => !!(i & (1 << idx)));
				const minuteConfig = Array.from({ length: blocks.length }, (_, idx) => !!(j & (1 << idx)));

				const result = tryConfiguration([hourConfig, minuteConfig]);

				if (result.unusedHours === 0 && result.unusedMinutes === 0) {
					return result.colors;
				}

				if (
					!bestSolution ||
					result.unusedHours + result.unusedMinutes <
						bestSolution.unusedHours + bestSolution.unusedMinutes
				) {
					bestSolution = result;
				}
			}
		}

		return bestSolution?.colors || blocks.map(() => 'dark:bg-gray-600 bg-gray-200');
	}

	function getMinuteBlockColors() {
		const colors = themes[colorTheme];
		let minutes = Math.floor(time.getMinutes() % 5);
		let hours = false;

		if (time.getHours() % 12 == 0) {
			hours = true;
		}

		if (getBlockColors()[-1]) {
			hours = true;
		}

		const result = Array(4).fill(hours ? colors.hour : null);

		for (let i = 0; i < minutes; i++) {
			result[i] = hours ? colors.both : colors.minute;
		}

		return result.reverse();
	}

	// Update time every second
	$effect(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);
		return () => clearInterval(interval);
	});

	$effect(() => {
		localStorage.setItem('colorTheme', colorTheme);
		localStorage.setItem('shapeTheme', shapeTheme);
		localStorage.setItem('glow', String(glow));
		localStorage.setItem('animate', String(animate));
		localStorage.setItem('showMinutes', String(showMinutes));
		localStorage.setItem('showLegend', String(showLegend));
		localStorage.setItem('bg', String(background));
	});

	function handleGridClick() {
		gridClicked = !gridClicked;
	}
</script>

{#if !loading}
	<div
		class="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300"
		style="background-image: url({background})"
	>
		<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
			<div class="relative {isFullscreen ? '' : 'space-y-4'}">
				{#if isFullscreen}
					<div
						class="fixed right-2 top-2 z-50 flex gap-2 rounded-lg bg-background p-2 opacity-0 shadow transition-opacity hover:opacity-100"
					>
						<LightSwitch />
						<Button variant="ghost" size="icon" onclick={() => (showLegend = !showLegend)}>
							<Info class="h-5 w-5" />
						</Button>
						<SettingsModal
							bind:showMinutes
							bind:colorTheme
							bind:glow
							{themes}
							bind:animate
							bind:shapeTheme
						/>
						<Button variant="ghost" size="icon" class="hidden lg:flex" onclick={toggleFullscreen}>
							{#if isFullscreen}
								<Minimize2 class="h-5 w-5" />
							{:else}
								<Maximize2 class="h-5 w-5" />
							{/if}
						</Button>
					</div>
				{:else}
					<div
						class="mb-8 flex w-full flex-col items-center gap-4 md:flex-row md:items-center md:justify-between"
					>
						<h1
							class={`bg-clip-text text-4xl font-bold text-transparent transition-all duration-300`}
							style={`background-image: linear-gradient(to right, ${themes[colorTheme].hour} , ${themes[colorTheme].minute});`}
						>
							Fibonacci Klok
						</h1>
						<div class="mt-4 flex gap-2 md:mt-0">
							<LightSwitch />
							<Button variant="ghost" size="icon" onclick={() => (showLegend = !showLegend)}>
								<Info class="h-5 w-5" />
							</Button>
							<SettingsModal
								bind:showMinutes
								bind:colorTheme
								bind:glow
								{themes}
								bind:animate
								bind:shapeTheme
							/>
							<Button variant="ghost" size="icon" class="hidden lg:flex" onclick={toggleFullscreen}>
								{#if isFullscreen}
									<Minimize2 class="h-5 w-5" />
								{:else}
									<Maximize2 class="h-5 w-5" />
								{/if}
							</Button>
						</div>
					</div>
				{/if}

				<!-- Grid container, with the click event to trigger rerender -->
				{#key gridClicked}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class={`grid aspect-[8/5] grid-cols-8 grid-rows-5 gap-2 transition-all duration-300 ${isFullscreen ? 'h-[95vh]' : 'w-[300px] md:w-[400px] lg:w-[600px]'} `}
						onclick={handleGridClick}
					>
						{#each blocks.slice(0, showMinutes ? -1 : blocks.length) as block, i}
							<Block
								{block}
								color={getBlockColors()[i]}
								index={i}
								style={shapeTheme}
								delay={(blocks.length + (showMinutes ? subBlocks.length : 0) - i) * 100 + 100}
								{glow}
								{animate}
								glass={background != ''}
							/>
						{/each}
						{#if showMinutes}
							<div class="grid grid-cols-2 grid-rows-2 gap-2">
								{#each subBlocks as block, i}
									<Block
										{block}
										color={getMinuteBlockColors()[i]}
										index={i - 1}
										style={shapeTheme == 'circle' ? 'rounded' : shapeTheme}
										delay={(blocks.length - i) * 100 + 100}
										{glow}
										{animate}
										glass={background != ''}
									/>
								{/each}
							</div>
						{/if}
					</div>
				{/key}
				{#if showLegend}
					<Legend {colorTheme} {themes} {isFullscreen} />
				{/if}
			</div>
		</div>
			<div class="fixed bottom-0 left-0 w-full py-2 text-center text-muted-foreground">
				<p class="text-sm">© 2025 Lucas Brouwer</p>
		</div>
	</div>
{/if}
