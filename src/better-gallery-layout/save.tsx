import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { BlockAttributes } from './types';

export default function save({
  attributes,
}: BlockSaveProps<BlockAttributes>): JSX.Element {
  const getSmallestImageUrl = (image: any): string => {
    const sizes = image.sizes || {};
    return (
      sizes.thumbnail?.url ||
      sizes.medium?.url ||
      sizes.medium_large?.url ||
      sizes.large?.url ||
      image.url
    );
  };

  return (
    <div {...useBlockProps.save()}>
      {attributes.images?.length > 0 && (
        <div
          className="better-gallery-layout-frontend"
          data-gap={attributes.gap}
          data-target-row-height={attributes.targetRowHeight}
          data-border-radius={attributes.radius}
        >
          {attributes.images.map((image, index) => (
            <img
              key={image.id || index}
              src={getSmallestImageUrl(image)}
              alt={image.alt || ''}
              data-image={JSON.stringify(image)}
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}