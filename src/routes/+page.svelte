<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Drawer, DrawerContent, DrawerTrigger } from '$lib/components/ui/drawer';
	import { Moon, Sun, Settings2, Maximize2, Minimize2, Info } from 'lucide-svelte';
	import LightSwitch from '$lib/components/LightSwitch.svelte';

	let time = $state(new Date());
	let showLegend = $state(false);
	let showDebug = $state(false);
	let debugHours = $state('12');
	let debugMinutes = $state('0');
	let isFullscreen = $state(false);
	let isDarkMode = $state(false);
	let showSettings = $state(false);

	// Fibonacci sequence for the clock: 1, 1, 2, 3, 5
	const blocks = [
		{ size: 5, value: 5, pos: [4, 1] }, // Large square
		{ size: 3, value: 3, pos: [1, 3] }, // Medium square
		{ size: 2, value: 2, pos: [1, 1] }, // Small square
		{ size: 1, value: 1, pos: [3, 2] }, // Tiny square 1
		{ size: 1, value: 1, pos: [3, 1] } // Tiny square 2
	];

	function getBlockColors() {
		let hours: number;
		let minutes: number;

		if (showDebug) {
			hours = parseInt(debugHours) % 12 || 12;
			minutes = Math.floor(parseInt(debugMinutes) / 5);
		} else {
			hours = time.getHours() % 12 || 12;
			minutes = Math.floor(time.getMinutes() / 5);
		}

		// Try all possible combinations to find the best solution
		let bestSolution: { colors: string[]; unusedHours: number; unusedMinutes: number } | null =
			null;

		// Helper function to calculate unused values
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
					if (configuration[0][index] && configuration[1][index]) return 'bg-blue-500';
					if (configuration[0][index]) return 'bg-red-500';
					if (configuration[1][index]) return 'bg-green-500';
					return 'bg-gray-200';
				})
			};
		}

		// Try all possible combinations
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

		return bestSolution?.colors || blocks.map(() => 'bg-gray-200');
	}

	function setDebugTime() {
		const h = parseInt(debugHours);
		const m = parseInt(debugMinutes);

		if (isNaN(h) || h < 1 || h > 12) {
			alert('Hours must be between 1 and 12');
			return;
		}
		if (isNaN(m) || m < 0 || m > 59) {
			alert('Minutes must be between 0 and 59');
			return;
		}

		showDebug = true;
	}

	// Update time every second (only when not in debug mode)
	$effect(() => {
		if (!showDebug) {
			const interval = setInterval(() => {
				time = new Date();
			}, 1000);
			return () => clearInterval(interval);
		}
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
</script>

<div class="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
	<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
		<!-- Header -->
		<div
			class="mb-8 flex w-full max-w-4xl flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<h1
				class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent"
			>
				Fibonacci Clock
			</h1>
			<div class="mt-4 flex gap-2 sm:mt-0">
				<LightSwitch />
				<Button variant="ghost" size="icon" class="hidden lg:flex" onclick={toggleFullscreen}>
					{#if isFullscreen}
						<Minimize2 class="h-5 w-5" />
					{:else}
						<Maximize2 class="h-5 w-5" />
					{/if}
				</Button>
				<Button variant="ghost" size="icon" onclick={() => (showLegend = !showLegend)}>
					<Info class="h-5 w-5" />
				</Button>
				<Drawer>
					<DrawerTrigger>
						<Button variant="ghost" size="icon">
							<Settings2 class="h-5 w-5" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div class="mx-auto max-w-md p-6">
							<h3 class="mb-4 text-lg font-semibold">Tijd aanpassen</h3>

							<!-- Debug Controls -->
							<div class="space-y-4">
								<div class="flex gap-4">
									<Input
										type="number"
										min="1"
										max="12"
										bind:value={debugHours}
										placeholder="Hours (1-12)"
									/>
									<Input
										type="number"
										min="0"
										max="59"
										bind:value={debugMinutes}
										placeholder="Minutes (0-59)"
									/>
								</div>
								<div class="flex gap-2">
									<Button
										class="w-full"
										variant={showDebug ? 'destructive' : 'default'}
										onclick={() => (showDebug ? (showDebug = false) : setDebugTime())}
									>
										{showDebug ? 'Modus verlaten' : 'Tijd instellen'}
									</Button>
								</div>
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</div>

		<div class="relative">
			<div
				class={`mb-6 grid aspect-[8/5] grid-cols-8 grid-rows-5 gap-2 transition-all duration-300 ${
					isFullscreen ? 'h-[80vh]' : 'w-[300px] md:w-[400px] lg:w-[600px]'
				}`}
			>
				{#each blocks as block, i}
					<div
						class={`rounded-lg duration-300 ${getBlockColors()[i]} motion-preset-pop group flex items-center justify-center rounded-xl shadow-md shadow-black/10 transition-all duration-300 dark:shadow-lg dark:shadow-black/20 `}
						style={`
						grid-column: ${block.pos[0]} / span ${block.size};
						grid-row: ${block.pos[1]} / span ${block.size};
					`}
					>
						<p
							class="text-2xl font-extrabold text-transparent transition-all duration-300 group-hover:text-foreground"
						>
							{block.value}
						</p>
					</div>
				{/each}
			</div>
			{#if showLegend}
				<div
					class="rounded-xl bg-white/90 p-4 shadow-lg transition-opacity duration-300 dark:bg-gray-800/90 md:absolute md:-right-48 md:top-1/2 md:-translate-y-1/2"
				>
					<div class="space-y-3">
						<div class="flex items-center gap-2">
							<div class="h-4 w-4 rounded bg-red-500"></div>
							<span class="dark:text-white">Hours</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="h-4 w-4 rounded bg-green-500"></div>
							<span class="dark:text-white">Minutes (×5)</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="h-4 w-4 rounded bg-blue-500"></div>
							<span class="dark:text-white">Both</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-600"></div>
							<span class="dark:text-white">Inactive</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div class="fixed bottom-0 left-0 w-full py-2 text-center text-muted-foreground">
		<p class="text-sm">© 2024 Bram Leisink</p>
	</div>
</div>
