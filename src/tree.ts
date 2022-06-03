export const getItemByName = (tree: Tree, name: string): Item => {
  let itemFound: Item | undefined = undefined;
  forEachChild(tree.root, (item) => {
    if (item.title === name && !itemFound) itemFound = item;
  });
  if (!itemFound) throw new Error(`Item '${name}' not found`);
  return itemFound;
};

export const forEachChild = (item: Item, cb: A2<Item, Item>) => {
  const traverse = (children: Item[]) => {
    children.forEach((c) => {
      cb(c, item);
      if (hasChildren(c)) forEachChild(c, cb);
    });
  };
  traverse(item.children);
};
export const forEachParent = (item: Item, cb: A1<Item>) => {
  let parent = item.parent;
  while (parent) {
    cb(parent);
    parent = parent.parent;
  }
};
const hasChildren = (item: Item) => item.children.length > 0;
