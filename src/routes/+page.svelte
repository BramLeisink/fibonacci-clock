<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import Legend from '$lib/components/Legend.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import Block from '$lib/components/Block.svelte';

	import { onMount } from 'svelte';

	import type { Themes, Blocks } from '$lib/types.ts';
	import { Info, Maximize2, Minimize2 } from 'lucide-svelte';

	let time = $state(new Date());
	let showLegend = $state(false);
	let isFullscreen = $state(false);
	let colorTheme: keyof typeof themes = $state('default');
	let shapeTheme: 'circle' | 'rounded' | 'square' = $state('rounded');
	let glow = $state(false);
	let animate = $state(true);
	let showMinutes = $state(true);

	const themes: Themes = {
		default: { hour: '#ef4444', minute: '#22c55e', both: '#3b82f6' },
		theme2: { hour: '#f97316', minute: '#eab308', both: '#a855f7' },
		theme3: { hour: '#ec4899', minute: '#14b8a6', both: '#6366f1' },
		theme4: { hour: '#06b6d4', minute: '#84cc16', both: '#ec4899' }
	};

	let blocks = $state([]) as Blocks;
	let subBlocks = $state([]) as Blocks;
	let gridClicked = $state(false); // This will trigger the rerender of blocks

	onMount(() => {
		const savedColorTheme = localStorage.getItem('colorTheme');
		const savedShapeTheme = localStorage.getItem('shapeTheme');
		const savedGlow = localStorage.getItem('glow');
		const savedAnimate = localStorage.getItem('animate');
		const savedShowMinutes = localStorage.getItem('showMinutes');
		const savedShowLegend = localStorage.getItem('showLegend');

		if (savedColorTheme && savedColorTheme in themes) {
			colorTheme = savedColorTheme as keyof typeof themes;
		}

		if (savedShapeTheme && ['circle', 'rounded', 'square'].includes(savedShapeTheme)) {
			shapeTheme = savedShapeTheme as 'circle' | 'rounded' | 'square';
		}

		if (savedGlow) {
			glow = (savedGlow === "true")
		}

		if (savedAnimate) {
			animate = (savedAnimate === "true")
		}

		if (savedShowMinutes) {
			showMinutes = (savedShowMinutes === "true")
		}

		if (savedShowLegend) {
			showLegend = (savedShowLegend === "true")
		}
		

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
	});

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
	});

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			isFullscreen = true;
		} else {
			document.exitFullscreen();
			isFullscreen = false;
		}
	}

	function handleGridClick() {
		gridClicked = !gridClicked;
	}
</script>

<div class="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
	<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
		<div class="relative">
			<div
				class="mb-8 flex w-full flex-col items-center gap-4 md:flex-row md:items-center md:justify-between"
			>
				<h1
					class={`bg-clip-text text-4xl font-bold text-transparent`}
					style={`background-image: linear-gradient(to right, ${themes[colorTheme].hour} , ${themes[colorTheme].minute});`}
				>
					Fibonacci Clock
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
			<!-- Grid container, with the click event to trigger rerender -->
			{#key gridClicked}
				<div
					class={`mb-6 grid aspect-[8/5] grid-cols-8 grid-rows-5 gap-2 transition-all duration-300 ${isFullscreen ? 'h-[80vh]' : 'w-[300px] md:w-[400px] lg:w-[600px]'} `}
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
								/>
							{/each}
						</div>
					{/if}
				</div>
			{/key}
			{#if showLegend}
				<Legend {colorTheme} {themes} />
			{/if}
		</div>
	</div>

	<!-- Credits -->
	<div class="fixed bottom-0 left-0 w-full py-2 text-center text-muted-foreground">
		<p class="text-sm">© 2024 Bram Leisink</p>
	</div>
</div>
