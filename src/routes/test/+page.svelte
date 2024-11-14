<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Drawer, DrawerContent, DrawerTrigger } from '$lib/components/ui/drawer';
	import { Moon, Sun, Settings2, Maximize2, Minimize2, Info } from 'lucide-svelte';

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

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark');
	}
</script>

<div
	class={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
>
	<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
		<!-- Header -->
		<div class="mb-8 flex w-full max-w-4xl items-center justify-between">
			<h1
				class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent"
			>
				Fibonacci Clock
			</h1>
			<div class="flex gap-2">
				<Button variant="ghost" size="icon" onclick={toggleDarkMode}>
					{#if isDarkMode}
						<Sun class="h-5 w-5" />
					{:else}
						<Moon class="h-5 w-5" />
					{/if}
				</Button>
				<Button variant="ghost" size="icon" onclick={toggleFullscreen}>
					{#if isFullscreen}
						<Minimize2 class="h-5 w-5" />
					{:else}
						<Maximize2 class="h-5 w-5" />
					{/if}
				</Button>
				<Drawer>
					<DrawerTrigger>
						<Button variant="ghost" size="icon">
							<Settings2 class="h-5 w-5" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div class="mx-auto max-w-md p-6">
							<h3 class="mb-4 text-lg font-semibold">Settings</h3>

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
										{showDebug ? 'Exit Debug Mode' : 'Set Debug Time'}
									</Button>
								</div>
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</div>

		<!-- Clock Display -->
		<div class="relative">
			<div
				class={`grid gap-2 transition-all duration-300 ${
					isFullscreen ? 'aspect-square h-[80vh]' : 'h-[400px] w-[400px]'
				}`}
			>
				{#each blocks as block, i}
					<div
						class={`rounded-xl transition-all duration-300 ${getBlockColors()[i]} ${isDarkMode ? 'shadow-lg shadow-black/20' : 'shadow-md shadow-black/10'} `}
						style={`-column: ${block.pos[0]} / span ${block.size};
							grid-row: ${block.pos[1]} / span ${block.size};
						`}
					/>
				{/each}
			</div>

			<!-- Legend -->
			<div
				class="absolute -right-48 top-1/2 -translate-y-1/2 rounded-xl bg-white/90 p-4 shadow-lg transition-opacity duration-300 dark:bg-gray-800/90"
			>
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
		</div>

		<!-- Controls -->
		<div class="mt-8 flex gap-4">
			<Button variant="outline" onclick={() => (showLegend = !showLegend)}>
				<Info class="mr-2 h-4 w-4" />
				Legend
			</Button>
		</div>
	</div>
</div>
