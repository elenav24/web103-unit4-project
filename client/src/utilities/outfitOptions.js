export const OUTFIT_OPTIONS = {
  top: [
    { key: 'blazer',        label: 'Blazer',        price: 120, style: 'formal' },
    { key: 'tshirt',        label: 'T-Shirt',        price: 25,  style: 'casual' },
    { key: 'hoodie',        label: 'Hoodie',         price: 60,  style: 'casual' },
    { key: 'athletic_top',  label: 'Athletic Top',   price: 40,  style: 'athletic' },
  ],
  bottom: [
    { key: 'dress_pants',   label: 'Dress Pants',    price: 90,  style: 'formal' },
    { key: 'jeans',         label: 'Jeans',          price: 70,  style: 'casual' },
    { key: 'athletic_shorts', label: 'Athletic Shorts', price: 35, style: 'athletic' },
    { key: 'skirt',         label: 'Skirt',          price: 55,  style: 'casual' },
  ],
  shoes: [
    { key: 'dress_shoes',   label: 'Dress Shoes',    price: 150, style: 'formal' },
    { key: 'sneakers',      label: 'Sneakers',       price: 80,  style: 'casual' },
    { key: 'running_shoes', label: 'Running Shoes',  price: 95,  style: 'athletic' },
    { key: 'sandals',       label: 'Sandals',        price: 45,  style: 'casual' },
  ],
  accessory: [
    { key: 'tie',           label: 'Tie',            price: 35,  style: 'formal' },
    { key: 'cap',           label: 'Cap',            price: 25,  style: 'casual' },
    { key: 'watch',         label: 'Watch',          price: 200, style: 'formal' },
    { key: 'headband',      label: 'Headband',       price: 15,  style: 'athletic' },
  ],
}

export const INCOMPATIBLE_PAIRS = [
  ['blazer',       'athletic_shorts', 'Formal top cannot be paired with athletic shorts'],
  ['blazer',       'running_shoes',   'Formal top cannot be paired with running shoes'],
  ['blazer',       'headband',        'Formal top cannot be paired with a headband'],
  ['athletic_top', 'dress_pants',     'Athletic top cannot be paired with dress pants'],
  ['athletic_top', 'dress_shoes',     'Athletic top cannot be paired with dress shoes'],
  ['athletic_top', 'tie',             'Athletic top cannot be paired with a tie'],
]
