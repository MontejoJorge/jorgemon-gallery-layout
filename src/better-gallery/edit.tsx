import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	BlockAlignmentToolbar,
} from "@wordpress/block-editor";
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

	return (
		<div {...useBlockProps()}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(120px, 160px))",
					gap: "10px",
					justifyContent: "center",
				}}
			>
				{attributes.images.map((i) => (
					<div
						key={i.id}
						style={{
							width: 150,
							height: 150,
							backgroundColor: "#f0f0f0",
							overflow: "hidden",
							borderRadius: 4,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<img
							src={i.sizes?.medium?.url || i.url}
							alt={i.alt}
							style={{
								maxWidth: "100%",
								maxHeight: "100%",
								objectFit: "contain",
							}}
						/>
					</div>
				))}
			</div>
			<MediaPlaceholder
				icon="format-gallery"
				onSelect={onSelectImages}
				accept="image/*"
				allowedTypes={["image"]}
				multiple
				value={attributes.images.map((image) => image.id)}
			/>
			<Inspector attributes={attributes} setAttributes={setAttributes} />
		</div>
	);
}
