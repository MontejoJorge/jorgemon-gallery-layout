import { __ } from "@wordpress/i18n";
import { useBlockProps, MediaPlaceholder } from "@wordpress/block-editor";
import type { BlockEditProps } from "@wordpress/blocks";

import "./editor.scss";

import Inspector from "./components/Inspector";
import type { BlockAttributes, WPImage } from "./types";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 */
export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<BlockAttributes>): JSX.Element {
	const onSelectImages = (images: WPImage[]): void => {
		setAttributes({ images });
	};

	const hasImages = attributes.images.length > 0;

	return (
		<div {...useBlockProps()}>
			{hasImages ? (
				<div className="better-gallery-editor-grid">
					{attributes.images.map((i) => (
						<div key={i.id} className="better-gallery-editor-cell">
							<img
								src={i.sizes?.medium?.url || i.url}
								alt={i.alt}
								className="better-gallery-editor-image"
							/>
						</div>
					))}
				</div>
			) : (
				<MediaPlaceholder
					icon="format-gallery"
					onSelect={onSelectImages}
					accept="image/*"
					allowedTypes={["image"]}
					multiple
					value={attributes.images.map((image) => image.id)}
				/>
			)}
			<Inspector attributes={attributes} setAttributes={setAttributes} />
		</div>
	);
}