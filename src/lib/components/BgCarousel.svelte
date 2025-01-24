<script lang="ts">
	import Autoplay from 'embla-carousel-autoplay';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	let { bgSetup }: { bgSetup: { images: string[]; delay: number } } = $props();
</script>

{#key bgSetup.delay}
	<Carousel.Root
		plugins={[
			Autoplay({
				delay: bgSetup.delay
			})
		]}
		opts={{
			loop: true
		}}
		class="fixed inset-0 -z-10 h-screen w-screen"
	>
		<Carousel.Content>
			{#each bgSetup.images as bgImage}
				<Carousel.Item class="relative h-full w-full">
					<img src={bgImage} alt="" class="h-full w-full object-cover" />
				</Carousel.Item>
			{/each}
		</Carousel.Content>
	</Carousel.Root>
{/key}
