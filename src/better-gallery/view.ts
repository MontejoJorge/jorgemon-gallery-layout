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
  const images: WPImage[] = JSON.parse(container.dataset.images ?? '[]');
  console.log(images);
  const gap = Number(container.dataset.gap ?? 5);
  const targetRowHeight = Number(container.dataset.targetRowHeight ?? 200);
  const containerWidth = container.clientWidth;

  const layout = computeJustifiedLayout(
    images,
    containerWidth,
    targetRowHeight,
    gap,
  );

  container.innerHTML = layout
    .map(
      (row, rowIndex) => `
        <div style="display:flex; justify-content:flex-start; gap:${gap}px;${rowIndex < layout.length - 1 ? ` margin-bottom:${gap}px;` : ''}">
            ${row
              .map((item) => {
                const widthStyle = item.fixedWidth
                  ? `width:${item.fixedWidth}px`
                  : `width:${item.widthPercent}%`;
                return `
                        <img
                            src="${item.image.url}"
                            alt="${item.image.alt ?? ''}"
                            style="${widthStyle}; height:${item.height}px; object-fit:cover; object-position:center; display:block;"
                        />
                    `;
              })
              .join('')}
        </div>
    `,
    )
    .join('');
}

document
  .querySelectorAll<HTMLElement>('.better-gallery-frontend')
  .forEach((container) => {
    renderGallery(container);

    const observer = new ResizeObserver(() => renderGallery(container));
    observer.observe(container);
  });
