// Product catalogue. Add or replace the image URL for each product with your
// own CDN/storage URL when real product photography is available.
export const products = [
  { id:'p-01', name:'Canvas Field Jacket', description:'Waxed cotton jacket with a corduroy collar, built for cold mornings.', category:'Apparel', price:6499, image:'/images/products/p-01.svg' },
  { id:'p-02', name:'Trail Runner Sneakers', description:'Lightweight mesh sneakers with a grippy lugged sole.', category:'Footwear', price:4299, image:'/images/products/p-02.svg' },
  { id:'p-03', name:'Merino Crew Socks', description:'Cushioned merino wool socks, three-pack.', category:'Footwear', price:899, image:'/images/products/p-03.svg' },
  { id:'p-04', name:'Leather Card Wallet', description:'Slim vegetable-tanned leather wallet with four card slots.', category:'Accessories', price:1799, image:'/images/products/p-04.svg' },
  { id:'p-05', name:'Ceramic Pour-Over Set', description:'Hand-glazed dripper and matching mug for slow mornings.', category:'Home', price:2199, image:'/images/products/p-05.svg' },
  { id:'p-06', name:'Wool Throw Blanket', description:'Heavyweight woven throw in a muted stripe pattern.', category:'Home', price:3599, image:'/images/products/p-06.svg' },
  { id:'p-07', name:'Enamel Camp Mug', description:'Chip-resistant enamel mug, holds 12oz.', category:'Home', price:549, image:'/images/products/p-07.svg' },
  { id:'p-08', name:'Wireless Desk Lamp', description:'Dimmable LED lamp with a wireless charging base.', category:'Electronics', price:2999, image:'/images/products/p-08.svg' },
  { id:'p-09', name:'Recycled Nylon Tote', description:'Packable tote made from recycled ripstop nylon.', category:'Accessories', price:1299, image:'/images/products/p-09.svg' },
  { id:'p-10', name:'Brass Desk Compass', description:'Working brass compass with a walnut base.', category:'Accessories', price:1999, image:'/images/products/p-10.svg' },
  { id:'p-11', name:'Insulated Steel Bottle', description:'Keeps drinks cold for 24 hours, 750ml.', category:'Home', price:1499, image:'/images/products/p-11.svg' },
  { id:'p-12', name:'Portable Bluetooth Speaker', description:'Compact speaker with 12-hour battery life, weather resistant.', category:'Electronics', price:3299, image:'/images/products/p-12.svg' },
]

export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

export function getProductById(productId) {
  return products.find((p) => p.id === productId) ?? null
}
