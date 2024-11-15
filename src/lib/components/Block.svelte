<script lang="ts">
	let { block, color, index, style }: { block: any; color: string; index: number; style: string } =
		$props();

	const rotationOffset = 2;

	// Function to calculate border-radius or styles for each style type
	function getBorderRadius(index: number, offset: number): string {
		switch (style) {
			case 'circle': {
				// Circle style: rounded corners based on index
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
				// Rounded style: consistent rounded corners
				return 'border-radius: 0.75rem;';
			}

			case 'square': {
				// Square style: no rounded corners
				return 'border-radius: 0;';
			}

			default: {
				return '';
			}
		}
	}
</script>

<div
	class={`group flex items-center justify-center bg-gray-200 shadow-md shadow-black/10 transition-all duration-300 dark:bg-gray-600 dark:shadow-lg dark:shadow-black/20`}
	style={`grid-column: ${block.pos[0]} / span ${block.size}; grid-row: ${block.pos[1]} / span ${block.size}; background-color: ${color}; ${getBorderRadius(index, rotationOffset)}`}
>
	<p
		class="text-2xl font-extrabold text-transparent transition-all duration-300 group-hover:text-foreground"
	>
		{block.value}
	</p>
</div>

<style>
	.top-left {
		border-top-left-radius: 100%;
		border-bottom-right-radius: 0.75rem;
		padding: 20% 0 0 20%;
	}
	.top-right {
		border-top-right-radius: 100%;
		border-bottom-left-radius: 0.75rem;
		padding: 20% 0 0 20%;
	}
	.bottom-right {
		border-bottom-right-radius: 100%;
		border-top-left-radius: 0.75rem;
		padding: 20% 0 0 20%;
	}
	.bottom-left {
		border-bottom-left-radius: 100%;
		border-top-right-radius: 0.75rem;
		padding: 20% 0 0 20%;
	}
</style>
