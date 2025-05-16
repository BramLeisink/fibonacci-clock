<script lang="ts">
	let {
		block,
		color,
		index,
		style,
		delay = 0,
		glow = false,
		animate = false,
		glass = false
	}: {
		block: any;
		color: string | null;
		index: number;
		style: string;
		delay: number;
		glow?: boolean;
		animate?: boolean;
		false?: boolean;
		glass?: boolean;
	} = $props();

	const rotationOffset = 2;

	// Function to calculate border-radius or styles for each style type
	function getBorderRadius(index: number, offset: number): string {
		switch (style) {
			case 'circle': {
				const corner = (index + offset) % 4;
				switch (corner) {
					case 0:
						return 'border-top-left-radius: 100%; border-bottom-right-radius: 0.75rem; padding: 20% 0 0 20%;';
					case 1:
						return 'border-top-right-radius: 100%; border-bottom-left-radius: 0.75rem; padding: 20% 20% 0 0;';
					case 2:
						return 'border-bottom-right-radius: 100%; border-top-left-radius: 0.75rem; padding: 0 20% 20% 0;';
					case 3:
						return 'border-bottom-left-radius: 100%; border-top-right-radius: 0.75rem; padding: 0 0 20% 20%;';
					default:
						return '';
				}
			}

			case 'rounded': {
				return 'border-radius: 0.75rem;';
			}

			case 'square': {
				return 'border-radius: 0;';
			}

			default: {
				return '';
			}
		}
	}
</script>

{#if false}
	<div class="motion-preset-pop"></div>
{/if}

{#if glass}
	<div
		class="group relative z-10 flex items-center justify-center bg-zinc-200/40 transition-all duration-300
		{animate ? 'motion-preset-pop' : ''} backdrop-blur"
		style={`grid-column: ${block.pos[0]} / span ${block.size}; grid-row: ${block.pos[1]} / span ${block.size}; background-color: ${color}66; ${getBorderRadius(index, rotationOffset)}; --motion-delay: ${delay}ms;`}
	>
		{#if block.value === 0.25}
			<p
				class="text-lg font-extrabold text-transparent transition-all duration-300 group-hover:text-foreground"
			>
				⅕
			</p>
		{:else}
			<p
				class="text-2xl font-extrabold text-transparent transition-all duration-300 group-hover:text-foreground"
			>
				{block.value}
			</p>
		{/if}
	</div>

	<div
		class={`group ${animate ? 'motion-preset-pop' : ''} relative flex items-center justify-center transition-all duration-300`}
		style={`grid-column: ${block.pos[0]} / span ${block.size}; grid-row: ${block.pos[1]} / span ${block.size}; ${getBorderRadius(index, rotationOffset)}; --motion-delay: ${delay}ms;`}
	>
		<div
			class="absolute inset-0 -z-10 transition-all duration-300"
			style={`background-color: ${color}66; ${getBorderRadius(index, rotationOffset)}; filter: blur(${glow ? '40px' : '0px'})`}
		></div>
	</div>
{:else}
	<div
		class={`group ${animate ? 'motion-preset-pop' : ''} relative z-10 flex items-center justify-center bg-zinc-200 shadow-md shadow-black/10 transition-all duration-300 dark:bg-zinc-600 dark:shadow-lg dark:shadow-black/20`}
		style={`grid-column: ${block.pos[0]} / span ${block.size}; grid-row: ${block.pos[1]} / span ${block.size}; background-color: ${color}; ${getBorderRadius(index, rotationOffset)}; --motion-delay: ${delay}ms;`}
	>
		{#if block.value === 0.25}
			<p
				class="text-lg font-extrabold text-transparent transition-all duration-300 group-hover:text-foreground"
			>
				⅕
			</p>
		{:else}
			<p
				class="text-2xl font-extrabold text-transparent transition-all duration-300 group-hover:text-foreground"
			>
				{block.value}
			</p>
		{/if}
	</div>

	<div
		class={`group ${animate ? 'motion-preset-pop' : ''} relative flex items-center justify-center transition-all duration-300`}
		style={`grid-column: ${block.pos[0]} / span ${block.size}; grid-row: ${block.pos[1]} / span ${block.size}; ${getBorderRadius(index, rotationOffset)}; --motion-delay: ${delay}ms;`}
	>
		<div
			class="absolute inset-0 -z-10 transition-all duration-300"
			style={`background-color: ${color}; ${getBorderRadius(index, rotationOffset)}; filter: blur(${glow ? '40px' : '0px'})`}
		></div>
	</div>
{/if}
