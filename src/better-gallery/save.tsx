import { useBlockProps } from "@wordpress/block-editor";
import type { BlockSaveProps } from "@wordpress/blocks";
import type { BlockAttributes } from "./types";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 */
export default function save({
	attributes,
}: BlockSaveProps<BlockAttributes>): JSX.Element {
	return (
		<div {...useBlockProps.save()}>
			{attributes.images?.length > 0 && (
				<div
					className="better-gallery-frontend"
					data-images={JSON.stringify(attributes.images)}
					data-gap={attributes.gap}
					data-target-row-height={attributes.targetRowHeight}
				/>
			)}
		</div>
	);
}