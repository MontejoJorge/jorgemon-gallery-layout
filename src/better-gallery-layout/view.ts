interface ImageSize {
  url: string;
  width: number;
  height: number;
}

interface WPImage {
  id: number;
  url: string;
  alt: string;
  sizes: {
    medium?: ImageSize;
    full?: ImageSize;
    [key: string]: ImageSize | undefined;
  };
}

interface LayoutItem {
  image: WPImage;
  widthPercent?: number;
  fixedWidth?: number;
  height: number;
}

function computeJustifiedLayout(
  images: WPImage[],
  containerWidth: number,
  targetRowHeight: number,
  gap: number,
): LayoutItem[][] {
  const rows: LayoutItem[][] = [];
  let currentRow: { image: WPImage; aspectRatio: number }[] = [];
  let aspectRatioSum = 0;

  for (const image of images) {
    const src = image.sizes?.medium || image.sizes?.full;
    const aspectRatio = (src?.width ?? 4) / (src?.height ?? 3);

    currentRow.push({ image, aspectRatio });
    aspectRatioSum += aspectRatio;

    const totalGap = gap * (currentRow.length - 1);
    const idealHeight = (containerWidth - totalGap) / aspectRatioSum;

    const heightVariance = 0.4;
    const minHeight = targetRowHeight * (1 - heightVariance);
    const maxHeight = targetRowHeight * (1 + heightVariance);

    const flushRow = (height: number) => {
      const totalWidth = currentRow.reduce(
        (sum, { aspectRatio }) => sum + aspectRatio * height,
        0,
      );
      rows.push(
        currentRow.map(({ image, aspectRatio }) => ({
          image,
          widthPercent: ((aspectRatio * height) / totalWidth) * 100,
          height,
        })),
      );
      currentRow = [];
      aspectRatioSum = 0;
    };

    if (idealHeight >= minHeight && idealHeight <= maxHeight) {
      flushRow(idealHeight);
    } else if (idealHeight < minHeight) {
      flushRow(targetRowHeight);
    }
  }

  if (currentRow.length > 0) {
    rows.push(
      currentRow.map(({ image, aspectRatio }) => ({
        image,
        fixedWidth: targetRowHeight * aspectRatio,
        height: targetRowHeight,
      })),
    );
  }

  return rows;
}

function renderGallery(container: HTMLElement) {
  const imgElements =
    container.querySelectorAll<HTMLImageElement>('img[data-image]');
  const images: WPImage[] = Array.from(imgElements).map((img) =>
    JSON.parse(img.dataset.image ?? '{}'),
  );

  const gap = Number(container.dataset.gap ?? 5);
  const targetRowHeight = Number(container.dataset.targetRowHeight ?? 200);
  const containerWidth = container.clientWidth;
  const borderRadius = container.dataset.borderRadius;

  const layout = computeJustifiedLayout(
    images,
    containerWidth,
    targetRowHeight,
    gap,
  );

  container.style.setProperty('--better-gallery-layout-gap', `${gap}px`);

  container
    .querySelectorAll('.better-gallery-layout-row')
    .forEach((el) => el.remove());

  imgElements.forEach((img) => (img.style.display = 'none'));

  layout.forEach((row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'better-gallery-layout-row';

    row.forEach((item) => {
      const img = document.createElement('img');

      const srcsetParts: string[] = [];
      if (item.image.sizes) {
        Object.entries(item.image.sizes).forEach(([key, size]) => {
          if (size?.url && size?.width) {
            srcsetParts.push(`${size.url} ${size.width}w`);
          }
        });
      }

      img.src = item.image.url;
      if (srcsetParts.length > 0) {
        img.srcset = srcsetParts.join(', ');
        img.sizes = `${item.fixedWidth ? `${item.fixedWidth}px` : `${item.widthPercent}vw`}`;
      }

      img.alt = item.image.alt ?? '';
      img.className = 'better-gallery-layout-image';
      img.style.width = item.fixedWidth
        ? `${item.fixedWidth}px`
        : `${item.widthPercent}%`;
      img.style.height = `${item.height}px`;
      img.style.borderRadius = `${borderRadius}px`
      rowEl.appendChild(img);
    });

    container.appendChild(rowEl);
  });
}

document
  .querySelectorAll<HTMLElement>('.better-gallery-layout-frontend')
  .forEach((container) => {
    renderGallery(container);
    const observer = new ResizeObserver(() => renderGallery(container));
    observer.observe(container);
  });
