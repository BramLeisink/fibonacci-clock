<script lang="ts">
	import type { Themes } from '$lib/types.ts';

	let { colorTheme, themes }: { colorTheme: keyof typeof themes; themes: Themes } = $props();
</script>

<div
	class="motion-scale-in-[0.5] motion-translate-x-in-[-25%] motion-translate-y-in-[25%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate rounded-xl bg-white/90 p-4 shadow-lg transition-opacity duration-300 dark:bg-gray-800/90 md:absolute md:-right-48 md:top-1/2 md:-translate-y-1/2"
>
	<div class="space-y-3">
		<div class="flex items-center gap-2">
			<div class={`h-4 w-4 rounded`} style={`background-color: ${themes[colorTheme].hour}`}></div>
			<span class="dark:text-white">Uren</span>
		</div>
		<div class="flex items-center gap-2">
			<div class={`h-4 w-4 rounded`} style={`background-color: ${themes[colorTheme].minute}`}></div>
			<span class="dark:text-white">Minuten (×5)</span>
		</div>
		<div class="flex items-center gap-2">
			<div class={`h-4 w-4 rounded`} style={`background-color: ${themes[colorTheme].both}`}></div>
			<span class="dark:text-white">Beide</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-600"></div>
			<span class="dark:text-white">Inactief</span>
		</div>
	</div>
</div>
