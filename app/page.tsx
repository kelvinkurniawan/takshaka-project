interface Settings {
  index_page?: string;
  [key: string]: string | undefined;
}

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Block/Content rendering types
interface CarouselItem {
  id: string;
  media: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

interface ColumnContent {
  id: string;
  type: "text" | "image" | "video" | "embed" | "carousel";
  content: string;
  imageProps?: {
    width: string;
    height: string;
    objectFit: "cover" | "contain" | "fill" | "scale-down";
    placement: "left" | "center" | "right";
    alt: string;
    borderRadius: string;
  };
  videoProps?: {
    width: string;
    height: string;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
  };
  carouselProps?: {
    itemsVisible: number;
    containerWidth: string;
    items: CarouselItem[];
  };
}

interface Block {
  id: string;
  columns: number;
  content: ColumnContent[];
  customCSS?: string;
}

interface PageContent {
  blocks: Block[];
}

async function getSettings(): Promise<Settings> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/settings`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return {};
    return response.json();
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

async function getPageById(pageId: number): Promise<Page | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/pages`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return null;
    const pages: Page[] = await response.json();
    return pages.find((page) => page.id === pageId) || null;
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return null;
  }
}

// Render carousel items
function renderCarousel(
  carousel: ColumnContent["carouselProps"],
): React.ReactNode {
  if (!carousel || !carousel.items.length) return null;

  return (
    <div
      className="carousel-container overflow-x-auto"
      style={{ width: carousel.containerWidth }}
    >
      <div className="flex gap-4">
        {carousel.items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 relative"
            style={{
              minWidth: `calc(${carousel.containerWidth} / ${carousel.itemsVisible})`,
            }}
          >
            {item.media && (
              <>
                {item.media.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={item.media}
                    className="w-full h-auto rounded"
                    autoPlay={false}
                    loop={false}
                    muted={false}
                    controls
                  />
                ) : (
                  <img
                    src={item.media}
                    alt={item.title || "carousel item"}
                    className="w-full h-auto object-cover rounded"
                  />
                )}
              </>
            )}
            {(item.title || item.subtitle) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white rounded-b">
                {item.title && (
                  <div className="font-semibold text-lg">{item.title}</div>
                )}
                {item.subtitle && (
                  <div className="text-sm opacity-90">{item.subtitle}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Render column content based on type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderColumnContent(column: ColumnContent): any {
  switch (column.type) {
    case "text":
      return (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: column.content }}
        />
      );

    case "image":
      if (!column.content) return null;
      const imgProps = column.imageProps || {
        width: "100%",
        height: "auto",
        objectFit: "cover" as const,
        placement: "center" as const,
        alt: "",
        borderRadius: "0px",
      };
      return (
        <div
          className={`flex justify-${imgProps.placement === "left" ? "start" : imgProps.placement === "right" ? "end" : "center"}`}
        >
          <img
            src={column.content}
            alt={imgProps.alt || "image"}
            style={{
              width: imgProps.width,
              height: imgProps.height,
              objectFit: imgProps.objectFit,
              borderRadius: imgProps.borderRadius,
            }}
            className="max-w-full h-auto"
          />
        </div>
      );

    case "video":
      if (!column.content) return null;
      const vidProps = column.videoProps || {
        width: "100%",
        height: "auto",
        autoplay: false,
        loop: false,
        muted: false,
      };
      return (
        <video
          src={column.content}
          style={{
            width: vidProps.width,
            height: vidProps.height,
          }}
          autoPlay={vidProps.autoplay}
          loop={vidProps.loop}
          muted={vidProps.muted}
          controls
          className="max-w-full h-auto rounded"
        />
      );

    case "embed":
      return (
        <div
          className="embed-container"
          dangerouslySetInnerHTML={{ __html: column.content }}
        />
      );

    case "carousel":
      return renderCarousel(column.carouselProps);

    default:
      return null;
  }
}

// Render a block with its columns
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: Block): any {
  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[block.columns] || "grid-cols-1";

  return (
    <div
      key={block.id}
      className={`grid ${gridColsClass} gap-6`}
      style={block.customCSS ? { ...parseCustomCSS(block.customCSS) } : {}}
    >
      {block.content.map((column) => (
        <div key={column.id} className="flex flex-col">
          {renderColumnContent(column)}
        </div>
      ))}
    </div>
  );
}

// Parse custom CSS string to inline styles
function parseCustomCSS(cssString: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: any = {};
  if (!cssString) return styles;

  // Simple CSS parser for common properties
  const rules = cssString.split(";");
  for (const rule of rules) {
    const [key, value] = rule.split(":");
    if (key && value) {
      const cssKey = key
        .trim()
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      styles[cssKey] = value.trim();
    }
  }
  return styles;
}

// Render entire page from parsed JSON content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPageContent(pageContent: string): any {
  try {
    const parsed: PageContent = JSON.parse(pageContent);
    const blocks = parsed.blocks || [];

    return (
      <div className="space-y-12">
        {blocks.map((block) => renderBlock(block))}
      </div>
    );
  } catch (error) {
    console.error("Failed to parse page content:", error);
    return (
      <div className="text-red-500">
        Error rendering page content. Invalid page structure.
      </div>
    );
  }
}

export default async function Home() {
  const settings = await getSettings();

  // Check if index_page is set
  const indexPageId = settings?.index_page
    ? parseInt(settings.index_page, 10)
    : null;
  let indexPage: Page | null = null;

  if (indexPageId && !isNaN(indexPageId)) {
    indexPage = await getPageById(indexPageId);
  }

  // If index page is set and found, render it
  if (indexPage) {
    return (
      <div className="min-h-screen bg-[#fff8f5]">
        <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="index-page-content">
            {renderPageContent(indexPage.content)}
          </div>
        </article>
      </div>
    );
  }

  // Default fallback - render empty or default content
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-gray-600 mb-6">
          Configure an index page in settings to display it here
        </p>
      </div>
    </div>
  );
}
