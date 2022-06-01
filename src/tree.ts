export const getItemByName = (tree: Tree, name: string): Item => {
  let itemFound: Item | undefined = undefined;
  forEachChild(tree.root, (item) => {
    if (item.title === name && !itemFound) itemFound = item;
  });
  if (!itemFound) throw new Error(`Item '${name}' not found`);
  return itemFound;
};

const forEachChild = (item: Item, cb: A2<Item, Item>) => {
  const traverse = (children: Item[]) => {
    children.forEach((c) => {
      cb(c, item);
      if (hasChildren(c)) forEachChild(c, cb);
    });
  };
  traverse(item.children);
};

const hasChildren = (item: Item) => item.children.length > 0;
