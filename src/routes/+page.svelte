<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Drawer, DrawerContent, DrawerTrigger } from '$lib/components/ui/drawer';
	import { Moon, Sun, Settings2, Maximize2, Minimize2, Info } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let time = $state(new Date());
	let showLegend = $state(false);
	let showDebug = $state(false);
	let debugHours = $state('12');
	let debugMinutes = $state('0');
	let isFullscreen = $state(false);
	let isDarkMode = $state(false);
	let showSettings = $state(false);
	let theme = $state('theme1'); // Define theme variable with a default theme

	// Define color schemes for each theme
	const themes = {
		theme1: {
			hour: 'red-500',
			minute: 'green-500',
			both: 'blue-500'
		},
		theme2: {
			hour: 'orange-500',
			minute: 'yellow-500',
			both: 'purple-500'
		},
		theme3: {
			hour: 'pink-500',
			minute: 'teal-500',
			both: 'indigo-500'
		},
		theme4: {
			hour: 'cyan-500',
			minute: 'lime-500',
			both: 'pink-500'
		}
	};

	// Fibonacci sequence for the clock: 1, 1, 2, 3, 5
	const blocks = [
		{ size: 5, value: 5, pos: [4, 1] },
		{ size: 3, value: 3, pos: [1, 3] },
		{ size: 2, value: 2, pos: [1, 1] },
		{ size: 1, value: 1, pos: [3, 2] },
		{ size: 1, value: 1, pos: [3, 1] }
	];

	function getBlockColors() {
		const colors = themes[theme]; // Select colors based on the current theme
		let hours: number;
		let minutes: number;

		if (showDebug) {
			hours = parseInt(debugHours) % 12 || 12;
			minutes = Math.floor(parseInt(debugMinutes) / 5);
		} else {
			hours = time.getHours() % 12 || 12;
			minutes = Math.floor(time.getMinutes() / 5);
		}

		let bestSolution: { colors: string[]; unusedHours: number; unusedMinutes: number } | null =
			null;

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
					return 'dark:bg-gray-600 bg-gray-200';
				})
			};
		}

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
		<div
			class="mb-8 flex w-full max-w-4xl flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<h1
				class={`bg-gradient-to-r from-${themes[theme].hour} to-${themes[theme].minute} bg-clip-text text-4xl font-bold text-transparent`}
			>
				Fibonacci Klok
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
				<Dialog.Root>
					<Dialog.Trigger>
						<Button variant="ghost" size="icon">
							<Settings2 class="h-5 w-5" />
						</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<div class="mx-auto max-w-md p-6">
							<h3 class="mb-4 text-lg font-semibold">Instellingen</h3>

							<!-- Theme Selection -->
							<div class="mb-4 grid grid-cols-4 gap-4">
								{#each Object.entries(themes) as [themeKey, colors]}
									<div
										class={`grid h-16 w-16 cursor-pointer grid-cols-2 grid-rows-2 rounded-lg shadow-lg transition-all duration-300`}
										onclick={() => (theme = themeKey)}
										title={themeKey}
									>
										<div
											class={`row-span-2 h-full w-full rounded-bl-lg rounded-tl-lg ${theme === themeKey ? 'opacity-80' : 'opacity-100'} bg-${colors.hour}`}
										></div>
										<div
											class={`h-full w-full rounded-tr-lg ${theme === themeKey ? 'opacity-80' : 'opacity-100'} bg-${colors.minute}`}
										></div>
										<div
											class={`h-full w-full rounded-br-lg ${theme === themeKey ? 'opacity-80' : 'opacity-100'} bg-${colors.both}`}
										></div>
									</div>
								{/each}
							</div>

							<Separator class="my-4" />

							<!-- Debug Controls -->
							<div class="space-y-4">
								<div class="flex gap-4">
									<Input
										type="number"
										min="1"
										max="12"
										bind:value={debugHours}
										placeholder="Uren (1-12)"
									/>
									<Input
										type="number"
										min="0"
										max="59"
										bind:value={debugMinutes}
										placeholder="Minuten (0-59)"
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
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>

		<div class="relative">
			<div
				class={`mb-6 grid aspect-[8/5] grid-cols-8 grid-rows-5 gap-2 transition-all duration-300 ${isFullscreen ? 'h-[80vh]' : 'w-[300px] md:w-[400px] lg:w-[600px]'}`}
			>
				{#each blocks as block, i}
					<div
						class={`rounded-lg duration-300 bg-${getBlockColors()[i]} group flex items-center justify-center rounded-xl shadow-md shadow-black/10 transition-all duration-300 dark:shadow-lg dark:shadow-black/20`}
						style={`grid-column: ${block.pos[0]} / span ${block.size}; grid-row: ${block.pos[1]} / span ${block.size};`}
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
							<div class={`h-4 w-4 rounded bg-${themes[theme].hour}`}></div>
							<span class="dark:text-white">Uren</span>
						</div>
						<div class="flex items-center gap-2">
							<div class={`h-4 w-4 rounded bg-${themes[theme].minute}`}></div>
							<span class="dark:text-white">Minuten (×5)</span>
						</div>
						<div class="flex items-center gap-2">
							<div class={`h-4 w-4 rounded bg-${themes[theme].both}`}></div>
							<span class="dark:text-white">Beide</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-600"></div>
							<span class="dark:text-white">Inactief</span>
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
