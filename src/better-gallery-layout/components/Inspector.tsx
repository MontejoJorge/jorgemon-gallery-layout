import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button, PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { BlockAttributes, WPImage } from '../types';

interface InspectorProps {
  attributes: BlockAttributes;
  setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

export default function Inspector({
  attributes,
  setAttributes,
}: InspectorProps): JSX.Element {
  const hasImages = attributes.images.length > 0;
  const hasImageIds =
    hasImages && attributes.images.some((image) => !!image.id);

  return (
    <InspectorControls>
      {hasImages && (
        <PanelBody title={__('Media')} initialOpen={true}>
          <MediaUploadCheck>
            <MediaUpload
              gallery
              multiple
              value={attributes.images.map((i) => i.id)}
              onSelect={(images) =>
                setAttributes({ images: images as WPImage[] })
              }
              allowedTypes={['image']}
              render={({ open }) => (
                <Button
                  variant="secondary"
                  onClick={open}
                  style={{ width: '100%', marginBottom: 8 }}
                >
                  {__('Edit / Reorder')}
                </Button>
              )}
            />
          </MediaUploadCheck>
          <MediaUploadCheck>
            <MediaUpload
              gallery
              addToGallery={hasImageIds}
              multiple
              value={attributes.images.map((i) => i.id)}
              onSelect={(newImages) =>
                setAttributes({
                  images: [...attributes.images, ...(newImages as WPImage[])],
                })
              }
              allowedTypes={['image']}
              render={({ open }) => (
                <Button
                  variant="secondary"
                  onClick={open}
                  style={{ width: '100%' }}
                >
                  {__('Add images')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>
      )}
      <PanelBody title={__('Layout options')} initialOpen={true}>
        <RangeControl
          label={__('Target photo height')}
          value={attributes.targetRowHeight}
          onChange={(value: number | undefined) =>
            setAttributes({ targetRowHeight: value ?? 0 })
          }
          help={__('The target height in pixels for each row of photos.')}
          min={20}
          max={1000}
        />
        <RangeControl
          label={__('Gap')}
          value={attributes.gap}
          onChange={(value: number | undefined) => {
            setAttributes({ gap: value ?? 0 });
          }}
          help={__('The space in pixels between photos.')}
          min={0}
          max={30}
        />
        <RangeControl
          label={__('Radius')}
          value={attributes.radius}
          onChange={(value: number | undefined) => {
            setAttributes({ radius: value ?? 0 });
          }}
          help={__('The border radius in pixels (rounded corners).')}
          min={0}
          max={40}
        />
      </PanelBody>
    </InspectorControls>
  );
}
