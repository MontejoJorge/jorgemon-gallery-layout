import { MediaPlaceholder, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import Inspector from './components/Inspector';
import './editor.scss';
import type { BlockAttributes, WPImage } from './types';

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
        <div className="better-gallery-layout-editor-grid">
          {attributes.images.map((i) => (
            <div key={i.id} className="better-gallery-layout-editor-cell">
              <img
                src={i.sizes?.medium?.url || i.url}
                alt={i.alt}
                className="better-gallery-layout-editor-image"
              />
            </div>
          ))}
        </div>
      ) : (
        <MediaPlaceholder
          icon="format-gallery"
          onSelect={onSelectImages}
          accept="image/*"
          allowedTypes={['image']}
          multiple
          value={attributes.images.map((image) => image.id)}
        />
      )}
      <Inspector attributes={attributes} setAttributes={setAttributes} />
    </div>
  );
}
