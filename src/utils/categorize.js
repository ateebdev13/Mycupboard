export function categorizeItem(item) {
  const text = `${item.category ?? ""} ${item.name ?? ""}`.toLowerCase();
  if (/dress|gown|jumpsuit|abaya|kaftan/.test(text)) return "onepiece";
  if (/jacket|coat|blazer|cardigan|shrug|outerwear|layer|shawl|waistcoat/.test(text)) return "outerwear";
  if (/shoe|heel|sandal|sneaker|boot|loafer|footwear|flat|mule|khussa|bag|clutch|jewelry|jewellery/.test(text))
    return "footwear";
  if (/pant|trouser|jean|skirt|shalwar|bottom|palazzo|capri|shorts/.test(text)) return "bottom";
  if (/shirt|t-shirt|tshirt|tee|top|blouse|kurta|tunic|sweater|polo/.test(text)) return "top";
  return "top";
}
