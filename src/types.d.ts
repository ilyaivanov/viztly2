type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  view?: "tree" | "board" | "gallery";
  galleryOptions?: GalleryOptions;

  type: ItemType;
  videoId?: string;
  // playlistId?: string;
  // channelId?: string;
  // image?: string;

  // isFinished?: boolean;

  // //non-persisted
  parent?: Item;
};

type Tree = {
  root: Item;
  selectedItem: Item;
  focusedItem: Item;
};

type AppState = {
  tree: Tree;
  views: Map<Item, ItemView>;
};

type ItemView = {
  gridX: number;
  gridY: number;
  x: AnimatedNumber;
  y: AnimatedNumber;

  opacity: AnimatedNumber;
  item: Item;

  image?: HTMLImageElement;
};

type GalleryOptions = {
  widthInGrid: number;
  heightInGrid: number;
  numberOfColumns: number;
};

// Utility types
//
//
//
//
type Predicate<T> = (a: T) => boolean;

type A1<T1> = (a: T1) => void;
type A2<T1, T2> = (a: T1, b: T2) => void;
type A3<T1, T2, T3> = (a: T1, b: T2, c: T3) => void;

type F1<T1> = () => T1;
type F2<T1, T2> = (a: T1) => T2;
type F3<T1, T2, T3> = (a: T1, b: T2) => T3;
