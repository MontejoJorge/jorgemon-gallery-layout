import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { BlockAttributes } from './types';

export default function save({
  attributes,
}: BlockSaveProps<BlockAttributes>): JSX.Element {
  return (
    <div {...useBlockProps.save()}>
      {attributes.images?.length > 0 && (
        <div
          className="better-gallery-layout-frontend"
          data-images={JSON.stringify(attributes.images)}
          data-gap={attributes.gap}
          data-target-row-height={attributes.targetRowHeight}
        />
      )}
    </div>
  );
}
