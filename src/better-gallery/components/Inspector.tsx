import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, RangeControl } from "@wordpress/components";
import type { BlockAttributes } from "../types";

interface InspectorProps {
	attributes: BlockAttributes;
	setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

export default function Inspector({
	attributes,
	setAttributes,
}: InspectorProps): JSX.Element {
	return (
		<InspectorControls>
			<PanelBody title="Better Gallery options" initialOpen={true}>
				<RangeControl
					label="Target photo height"
					value={attributes.targetRowHeight}
					onChange={(value: number | undefined) =>
						setAttributes({ targetRowHeight: value ?? 0 })
					}
					help="The target height in pixels for each row of photos."
					min={20}
					max={1000}
				/>
				<RangeControl
					label="Gap"
					value={attributes.gap}
					onChange={(value: number | undefined) => {
						console.log(value);
						setAttributes({ gap: value ?? 0 });
					}}
					help="The space in pixels between photos."
					min={0}
					max={30}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
