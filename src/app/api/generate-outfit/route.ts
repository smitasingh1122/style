import { NextResponse } from "next/server";

type ProfileData = {
  name: string;
  age: string;
  gender: string;
  bodyType: string;
  height: string;
  measurements: string;
  skinTone: string;
  undertone: string;
  stylePreferences: string;
  budget: string;
  avoid: string;
  occasion: string;
  season: string;
};

// --- FEMININE WARDROBE DATABASES ---
const TOPS: Record<string, Record<string, string[]>> = {
  hourglass: {
    minimalist: ["A fitted cashmere V-neck sweater in a soft neutral tone", "A tailored silk wrap blouse with subtle draping", "A structured peplum top in matte crepe"],
    boho: ["A flowing off-shoulder peasant blouse with delicate embroidery", "A cropped crochet top layered over a silk camisole", "A billowy poet-sleeve blouse in lightweight cotton"],
    streetwear: ["An oversized cropped graphic tee with raw-hem detailing", "A fitted mesh layering top under an open flannel", "A boxy crop hoodie in washed-out vintage tones"],
    classic: ["A crisp white button-down shirt tailored at the waist", "A silk charmeuse blouse with French cuffs", "A fitted turtleneck in fine merino wool"],
    default: ["A luxurious silk slip camisole with a delicate cowl neck", "A relaxed linen blend top with subtle pleating", "A draped jersey wrap top in a rich jewel tone"],
  },
  pear: {
    minimalist: ["A structured boat-neck top in heavyweight jersey", "An architectural off-shoulder blouse with clean lines", "A boxy cropped knit with ribbed detailing"],
    boho: ["A romantic flutter-sleeve blouse with tassel ties", "An embroidered tunic top in breezy gauze fabric", "A lace-trimmed camisole layered under a kimono"],
    streetwear: ["A bold statement graphic sweatshirt with drop shoulders", "A color-block oversized tee with rolled sleeves", "A cropped bomber-style knit top"],
    classic: ["A darted blazer-style blouse with puffed shoulders", "A ruffled neckline silk blouse in a vivid color", "A structured cape-sleeve top in Italian wool"],
    default: ["A statement-sleeve blouse that draws attention upward", "A boat-neck striped Breton top in soft cotton", "A detailed shoulder-emphasis blouse with embellishment"],
  },
  apple: {
    default: ["A flowing empire-waist tunic in silk chiffon", "An A-line peplum blouse that skims the midsection", "A V-neck drape-front top in matte jersey"],
    minimalist: ["A longline V-neck in structured ponte fabric", "A relaxed column top in breathable linen", "A minimalist trapeze top with clean seams"],
    classic: ["A tailored wrap blouse with self-tie belt", "An elegant button-front blouse in fine poplin", "A smart shirred-detail blouse with three-quarter sleeves"],
    boho: ["A tiered ruffle blouse with a deep V-neck", "A free-flowing kaftan-style top in printed silk", "An artisan-dyed swing top with handcrafted details"],
    streetwear: ["A longline oversized tee with asymmetric hem", "A relaxed fit hoodie in premium organic cotton", "A layered tank and open shirt combo"],
  },
  rectangle: {
    default: ["A ruched bodysuit that creates curves", "A corset-style top with structured boning", "A wrap-front blouse with gathering at the waist"],
    minimalist: ["A ribbed knit bodysuit with a square neckline", "A sleek mock-neck top with side ruching", "A fitted ponte top with seam detailing"],
    classic: ["A belted silk blouse with bishop sleeves", "A tailored jacket-blouse hybrid with cinched waist", "A peplum blazer top in structured twill"],
    boho: ["A cinched-waist embroidered crop top", "A tie-front bohemian blouse with balloon sleeves", "A smocked bodice top in printed voile"],
    streetwear: ["A lace-up corset tee over a long-sleeve base", "A ruched mesh top with bold graphics", "A belted utility crop top in canvas"],
  },
  inverted_triangle: {
    default: ["A simple scoop-neck camisole in fluid fabric", "A minimalist halter top with clean lines", "A fitted V-neck tee in premium pima cotton"],
    minimalist: ["A sleeveless structured shell top", "A fine-gauge knit tank with delicate straps", "A fluid silk tee with raglan sleeves"],
    classic: ["A softly tailored cap-sleeve blouse", "A lightweight cashmere crew neck", "An elegant mock-wrap top in crepe"],
    boho: ["A relaxed camisole with thin straps and lace trim", "A simple embroidered shell in earthy tones", "A loose tank with artisan print"],
    streetwear: ["A fitted ribbed tank top in neutral tones", "A sleek seamless athletic crop top", "A simple oversized V-neck tee"],
  },
};

const BOTTOMS: Record<string, Record<string, string[]>> = {
  hourglass: {
    default: ["High-waisted wide-leg linen trousers with sharp pleats", "A pencil skirt in stretch crepe that hugs your curves", "Tailored straight-leg trousers with a contoured waistband"],
    minimalist: ["Sleek high-waisted cigarette pants in black wool", "A structured A-line midi skirt", "Clean-line wide-leg trousers in ivory"],
    classic: ["Perfectly tailored high-rise dress pants", "A knee-length fitted skirt in fine suiting", "Pleated palazzo pants in rich navy"],
    boho: ["A flowing maxi skirt with a fitted waistband", "Printed wide-leg pants with a paper-bag waist", "A tiered midi skirt in natural linen"],
    streetwear: ["High-waisted baggy cargo pants with tapered ankles", "Relaxed-fit straight jeans with a contoured waist", "Wide-leg track pants with side-stripe detail"],
  },
  pear: {
    default: ["A-line midi skirt in structured fabric", "Straight-leg dark-wash denim with a high rise", "Wide-leg palazzo pants in a dark, elongating color"],
    minimalist: ["High-waisted straight trousers in deep navy", "A minimalist dark pleat-front pant", "Clean wide-leg trousers in charcoal wool"],
    classic: ["Dark tailored bootcut trousers", "A structured fit-and-flare skirt", "Pressed-crease wide-leg pants in midnight"],
    boho: ["A flowing dark maxi skirt with subtle print", "Dark wide-leg linen pants with drawstring waist", "An asymmetric midi skirt in deep tones"],
    streetwear: ["Straight-leg dark denim with high waist", "Wide-leg black cargo pants", "Dark relaxed joggers with minimal branding"],
  },
  apple: {
    default: ["Straight-leg trousers with an elastic back waist", "An A-line midi skirt with hidden elastic", "Bootcut pants in dark stretch fabric"],
    minimalist: ["Relaxed straight-leg pants in ponte knit", "A fluid A-line skirt in structured jersey", "Pull-on wide-leg trousers in matte black"],
    classic: ["Tailored straight-leg pants with flat front", "A structured knee-length A-line skirt", "Classic trouser-cut pants in rich wool"],
    boho: ["Flowy wide-leg pants in printed challis", "A tiered maxi skirt in soft cotton", "Palazzo pants in batik-print silk"],
    streetwear: ["Relaxed cargo pants with straight leg", "Wide-leg joggers in premium fleece", "Straight-cut denim with stretch"],
  },
  rectangle: {
    default: ["A high-waisted pleated mini skirt", "Skinny jeans with detailed pocket stitching", "A flared midi skirt with belt"],
    minimalist: ["Belted high-rise straight trousers", "A wrapped midi skirt with tie closure", "Tailored peg-leg pants with belt"],
    classic: ["A full A-line skirt with petticoat lining", "High-waisted pleated wide-leg trousers", "A pencil skirt with contour seaming"],
    boho: ["A ruffled asymmetric wrap skirt", "Printed flare pants with embroidered hem", "A layered tulle midi skirt"],
    streetwear: ["Belted wide cargo pants", "Pleated utility skirt with chain details", "High-waisted flared track pants"],
  },
  inverted_triangle: {
    default: ["Bold printed wide-leg palazzo pants", "A voluminous maxi skirt with bold pattern", "Structured wide-leg trousers in a rich hue"],
    minimalist: ["Wide-leg trousers in a statement color", "A structured A-line midi in bold tone", "Relaxed wide-leg pants in rich camel"],
    classic: ["Pleated wide-leg pants in a jewel tone", "A full midi skirt in rich fabric", "Bootcut trousers in bold burgundy"],
    boho: ["A heavily embroidered wide-leg pant", "A tiered printed maxi skirt", "Patterned palazzo pants with fringe hem"],
    streetwear: ["Wide-leg cargo pants in bold color", "Relaxed-fit printed joggers", "Flared jeans with contrast stitching"],
  },
};

const FOOTWEAR: Record<string, string[]> = {
  spring: ["Minimalist strappy leather sandals with a modest block heel", "Pointed-toe ballet flats in soft suede", "Low-heeled slingback pumps in pastel leather", "Canvas espadrilles with jute sole detailing"],
  summer: ["Delicate slide sandals with metallic accents", "Woven leather mules in natural tan", "Strappy heeled sandals in warm gold", "Embellished flat thong sandals in raffia"],
  autumn: ["Suede ankle boots with a sculptural heel", "Pointed-toe Chelsea boots in rich burgundy", "Leather loafers with gold-bit hardware", "Block-heel knee boots in deep chocolate"],
  winter: ["Sleek over-the-knee boots in supple leather", "Structured ankle boots with lug sole and shearling lining", "Polished leather knee boots with pointed toe", "Chunky platform boots in patent black"],
  default: ["Minimalist strappy leather sandals with a modest block heel", "Pointed-toe block-heel pumps in neutral leather", "Classic leather loafers with metal detail"],
};

const ACCESSORIES: Record<string, string[][]> = {
  warm: [
    ["A structured mini top-handle bag in embossed croc", "Layered delicate gold chains", "Oversized tortoiseshell sunglasses"],
    ["A woven straw clutch with gold clasp", "Hammered gold cuff bracelet", "Round aviator sunglasses in warm tortoise"],
    ["A tan leather belt bag with brass hardware", "Gold signet ring and ear cuffs", "Cat-eye sunglasses in amber"],
  ],
  cool: [
    ["A sleek silver chain-link shoulder bag", "Sterling silver layered pendant necklaces", "Geometric silver-frame sunglasses"],
    ["A structured clutch in steel-blue leather", "Platinum-tone watch with minimalist face", "Rimless tinted sunglasses in cool blue"],
    ["A quilted crossbody in icy lavender", "Pearl stud earrings with silver settings", "Oversized square sunglasses in slate"],
  ],
  neutral: [
    ["A woven leather bucket bag in mushroom grey", "Mixed-metal layered bracelets", "Transparent-frame sunglasses"],
    ["A structured tote in greige pebbled leather", "Minimalist rose-gold watch", "Classic wayfarer sunglasses in matte black"],
    ["A canvas and leather crossbody", "Delicate chain necklace with gemstone pendant", "Round sunglasses in brushed gold"],
  ],
};

const MAKEUP: Record<string, Record<string, string>> = {
  warm: {
    fair: "Luminous skin with a peach-toned primer, soft coral blush, warm copper eyeshadow, and a peachy-nude satin lip.",
    light: "Dewy skin finish with a warm golden highlight, soft terracotta blush, and a warm nude lip with caramel gloss.",
    medium: "A radiant base with golden undertones, brick-rose blush, smoky bronze eyeshadow, and a warm berry lip stain.",
    tan: "A satin-matte base, burnt sienna blush, rich copper eye look, and a spiced nude lipstick.",
    deep: "Luminous deep-tone base, a flush of warm plum blush, shimmering bronze eyeshadow, and a rich mahogany lip color.",
    rich: "A flawless, radiant complexion with deep amber highlight, molten gold eyes, and an opulent burgundy lip.",
  },
  cool: {
    fair: "A porcelain-finish base, soft pink blush, shimmery mauve eyeshadow, and a cool pink satin lip.",
    light: "Dewy skin with a pink-toned highlight, raspberry blush, and a rose-pink lip gloss.",
    medium: "A natural matte base, dusty rose blush, cool taupe eyeshadow, and a mauve lip with a velvet finish.",
    tan: "A luminous base with cool-tone setting powder, berry blush, rich plum eyeshadow, and a cool berry satin lip.",
    deep: "A flawless deep-toned base, cool wine-toned blush, smoky charcoal eyeshadow, and a deep plum matte lip.",
    rich: "A radiant ebony base with cool highlight, deep fuchsia blush, midnight blue eyeshadow, and a bold cool red lip.",
  },
  neutral: {
    fair: "A natural soft-focus base, peach-pink blush, neutral taupe eyeshadow, and a my-lips-but-better nude lip.",
    light: "Dewy skin with a balanced highlight, soft rose blush, warm taupe eyeshadow, and a rosy nude lip.",
    medium: "A satin-matte finish, dusty pink blush, bronze eyeshadow, and a neutral pink-brown lip.",
    tan: "A luminous medium base, warm-rose blush, soft bronze eyeshadow, and a neutral mauve lip.",
    deep: "A radiant base with balanced highlight, warm berry blush, rich brown eyeshadow, and a neutral berry lip.",
    rich: "A flawless deep-toned complexion, warm-cool berry blush, deep chocolate eyeshadow, and a neutral-toned lip.",
  },
};

// --- MASCULINE WARDROBE DATABASES ---
const MALE_TOPS: Record<string, Record<string, string[]>> = {
  inverted_triangle: {
    minimalist: ["A fine-gauge merino wool crew neck sweater in navy", "A crisp, tailored poplin button-down shirt", "A slim-fit high-neck mock sweater"],
    boho: ["A relaxed-fit linen popover shirt with a grandad collar", "An open camp-collar printed viscose shirt over a tank", "A textured slub-cotton henley"],
    streetwear: ["An oversized heavy-weight boxy tee", "A layered vintage graphic tee under an open flannel", "A dropped-shoulder premium hoodie"],
    classic: ["A tailored slim-fit double-breasted linen suit jacket", "A structured oxford cloth button-down with a subtle texture", "A fine knit polo shirt with contrasting trim"],
    default: ["A crisp white banded-collar shirt", "A tailored dark chambray work shirt", "A fitted charcoal crew neck tee"],
  },
  rectangle: {
    minimalist: ["A textured waffle-knit long sleeve henley", "A structured chore coat over a simple white tee", "A tailored mock-neck sweater in camel"],
    boho: ["A relaxed overshirt in brushed cotton with patch pockets", "A loose-weave linen shirt with rolled sleeves", "A washed denim western shirt"],
    streetwear: ["A multi-pocket utility vest layered over a hoodie", "An oversized quarter-zip sweatshirt", "A boxy, drop-shoulder graphic tee"],
    classic: ["A structured tweed blazer over a fine knit roll-neck", "A smart tailored waistcoat layered over a crisp shirt", "A classic cable-knit sweater"],
    default: ["A structured denim jacket layered over a basic tee", "A tailored bomber jacket with clean lines", "A chunky knit cardigan with shawl collar"],
  },
  oval: { // Apple equivalent
    minimalist: ["A relaxed-fit unstructured blazer over a dark tee", "A lightweight, fluid dark-toned overshirt", "A high-quality dark jersey V-neck"],
    boho: ["A flowy patterned camp shirt worn unbuttoned", "A relaxed lightweight linen tunic", "An open knit cardigan with a draped front"],
    streetwear: ["A loose-fitting dark tech-wear jacket", "An oversized heavyweight hoodie in matte black", "A longline relaxed graphic tee"],
    classic: ["A single-breasted jacket with a strong shoulder", "A classic dark tailored overcoat", "A fine-gauge dark knit sweater vest over a shirt"],
    default: ["A tailored mid-weight overshirt in navy", "A relaxed fit dark-wash denim jacket", "A dark, structured Harrington jacket"],
  },
  triangle: { // Pear equivalent
    minimalist: ["A structured topcoat with strong lapels", "A thick rib-knit sweater that adds breadth to the shoulders", "A tailored shirt with subtle shoulder details"],
    boho: ["A patterned brushed cotton overshirt with dual chest pockets", "A chunky knit patterned cardigan", "A textured corduroy jacket"],
    streetwear: ["A padded bomber jacket with contrast lining", "A heavy graphic hoodie with drop shoulders", "A color-blocked windbreaker"],
    classic: ["A tailored blazer with structured shoulders", "A classic trench coat", "A heavy oxford shirt with flap pockets"],
    default: ["A structured military-style jacket", "A tailored sports coat with a crisp white shirt", "A textured crew-neck sweater"],
  },
};

const MALE_BOTTOMS: Record<string, Record<string, string[]>> = {
  inverted_triangle: {
    default: ["Tailored straight-leg chinos in warm tan", "Relaxed-fit raw denim jeans", "Pleated wide-leg trousers in charcoal"],
    minimalist: ["Clean front tailored trousers in navy", "Minimalist straight-leg black jeans", "Tapered wool blend slacks"],
    classic: ["Classic straight-leg selvedge denim", "Pleated dress pants in light grey", "Tailored corduroy trousers in rich brown"],
    boho: ["Relaxed linen trousers with a drawstring waist", "Washed olive fatigue pants", "Loose-fit wide-leg cotton pants"],
    streetwear: ["Relaxed-fit cargo pants with ankle ties", "Wide-leg washed denim with a slight pool at the shoe", "Heavyweight fleece joggers"],
  },
  rectangle: {
    default: ["Slim-straight indigo jeans", "Tailored flat-front chinos", "Textured wool trousers with a subtle taper"],
    minimalist: ["Sleek black slim-fit jeans", "Tailored performance chinos in dark grey", "Minimalist technical pants with hidden pockets"],
    classic: ["Classic fit dark-wash jeans", "Tailored houndstooth trousers", "Flat-front dress slacks in navy"],
    boho: ["Garment-dyed straight leg canvas pants", "Relaxed fit patterned trousers", "Washed denim with subtle distressing"],
    streetwear: ["Straight-leg skate chinos", "Multi-pocket tactical pants", "Relaxed fit track pants with side stripes"],
  },
  oval: {
    default: ["Straight-leg dark wash jeans with stretch", "Tailored dark chinos with a comfortable rise", "Relaxed straight-leg wool trousers"],
    minimalist: ["Clean dark grey straight-leg pants", "Minimalist black straight-fit denim", "Navy performance trousers"],
    classic: ["Classic dark flat-front dress pants", "Straight-leg dark corduroys", "Tailored charcoal slacks"],
    boho: ["Relaxed dark linen-blend pants", "Dark olive straight-leg fatigue pants", "Washed black relaxed denim"],
    streetwear: ["Relaxed fit dark cargo pants", "Straight-cut dark wash skate jeans", "Heavyweight black joggers"],
  },
  triangle: {
    default: ["Dark wash straight-leg jeans", "Tailored dark navy chinos", "Charcoal flat-front trousers"],
    minimalist: ["Sleek dark straight-leg pants", "Minimalist black denim", "Dark grey tailored slacks"],
    classic: ["Classic navy dress pants", "Dark brown straight-leg corduroys", "Tailored black trousers"],
    boho: ["Dark washed canvas pants", "Relaxed fit dark linen trousers", "Olive straight-leg chinos"],
    streetwear: ["Dark straight-fit cargo pants", "Black relaxed skate jeans", "Dark technical track pants"],
  },
};

const MALE_FOOTWEAR: Record<string, string[]> = {
  spring: ["Minimalist white leather low-top sneakers", "Suede desert boots in light sand", "Classic leather penny loafers", "Canvas slip-on sneakers"],
  summer: ["Woven leather loafers", "Minimalist leather slides", "Clean white canvas low-tops", "Suede driving shoes in navy"],
  autumn: ["Polished dark brown leather loafers", "Suede Chelsea boots in rich tobacco", "Chunky sole leather derbies", "Rugged leather lace-up boots"],
  winter: ["Heavy-duty leather combat boots", "Gore-Tex trimmed winter boots", "Leather Chelsea boots with a lug sole", "Classic leather brogues in oxblood"],
  default: ["Polished dark brown leather loafers", "Minimalist white leather sneakers", "Classic suede Chelsea boots"],
};

const MALE_ACCESSORIES: Record<string, string[][]> = {
  warm: [
    ["A minimalist silver dive watch", "A woven leather bracelet in rich brown", "Tortoiseshell aviator sunglasses"],
    ["A vintage gold-tone dress watch", "A simple brass cuff", "Classic clubmaster sunglasses"],
    ["A tan leather weekend duffle bag", "A subtle gold chain", "Square frame sunglasses in amber"],
  ],
  cool: [
    ["A sleek stainless steel chronograph watch", "A minimalist silver chain", "Black wayfarer sunglasses"],
    ["A black leather briefcase", "A simple platinum ring", "Geometric silver-frame sunglasses"],
    ["A matte black automatic watch", "A sterling silver cuff", "Rimless tinted sunglasses in cool grey"],
  ],
  neutral: [
    ["A classic watch with a grey suede strap", "A simple titanium band", "Transparent-frame sunglasses"],
    ["A canvas messenger bag with leather trim", "A minimalist steel watch", "Classic wayfarer sunglasses in matte black"],
    ["A subtle beaded bracelet in earthy tones", "A brushed steel watch", "Round sunglasses in gunmetal"],
  ],
};

const MALE_GROOMING: Record<string, Record<string, string>> = {
  warm: {
    fair: "A clean, hydrated face with a lightweight matte moisturizer, well-groomed brows, and a subtle amber-scented beard oil or aftershave.",
    light: "A fresh, glowing complexion using a vitamin C serum, styled textured hair with a matte clay, and a warm woody cologne.",
    medium: "A flawless matte finish using a sheer tinted moisturizer, neatly trimmed facial hair with a touch of conditioning balm, and a spiced tobacco fragrance.",
    tan: "Hydrated, radiant skin with a touch of bronzing serum, perfectly lined facial hair, and a warm cedarwood and vanilla scent.",
    deep: "A smooth, richly moisturized base using shea butter, a sharp edge-up, and a sophisticated oud and sandalwood fragrance.",
    rich: "A deeply nourished, glowing complexion, immaculately groomed beard with a glossing oil, and a bold, warm amber fragrance.",
  },
  cool: {
    fair: "A crisp, clean-shaven face with a soothing aloe aftershave, neatly combed hair with a high-shine pomade, and a fresh aquatic cologne.",
    light: "A smooth, clear complexion using a gentle exfoliant, a structured haircut with a cool-finish gel, and a crisp citrus scent.",
    medium: "A matte, even skin tone with a pore-minimizing primer, a sharp fade haircut, and a cool mint and vetiver fragrance.",
    tan: "A fresh, hydrated base with a lightweight gel moisturizer, a well-maintained short beard, and a clean sea-salt spray for hair texture.",
    deep: "A flawless, even complexion with a touch of mattifying powder, a precision haircut, and a sophisticated cool musk fragrance.",
    rich: "A vibrant, hydrated base using a lightweight oil, a sharply groomed beard, and an elegant cool-toned leather and bergamot scent.",
  },
  neutral: {
    fair: "A balanced, natural complexion with a daily SPF moisturizer, effortlessly tousled hair using sea salt spray, and a light musk cologne.",
    light: "A healthy, even skin tone with a subtle brightening serum, neatly styled hair with a medium-hold paste, and a clean linen scent.",
    medium: "A smooth, hydrated base, a well-groomed stubble, and a versatile, fresh sandalwood and bergamot fragrance.",
    tan: "A radiant, healthy glow with a hydrating mist, a natural hair texture with a light cream, and a classic vetiver scent.",
    deep: "A rich, well-moisturized complexion, a neatly trimmed beard or clean shave, and a smooth, balanced cedar fragrance.",
    rich: "A flawless, glowing base with a nourishing facial oil, a precision-cut hairstyle, and a sophisticated, universally appealing musk.",
  },
};

// --- SHARED PALETTES ---
const PALETTES: Record<string, Record<string, { hex: string; name: string }[]>> = {
  warm: {
    spring: [{ hex: "#FAF0E6", name: "Linen" }, { hex: "#FFDAB9", name: "Peach" }, { hex: "#CD853F", name: "Warm Tan" }, { hex: "#B76E79", name: "Rose Gold" }],
    summer: [{ hex: "#FFF8DC", name: "Cornsilk" }, { hex: "#F4A460", name: "Sandy Brown" }, { hex: "#D2691E", name: "Chocolate" }, { hex: "#CD853F", name: "Peru" }],
    autumn: [{ hex: "#DEB887", name: "Burlwood" }, { hex: "#A0522D", name: "Sienna" }, { hex: "#8B4513", name: "Saddle Brown" }, { hex: "#D2B48C", name: "Tan" }],
    winter: [{ hex: "#FDFBF7", name: "Ivory" }, { hex: "#C19A6B", name: "Camel" }, { hex: "#8B0000", name: "Dark Red" }, { hex: "#2C2C2C", name: "Charcoal" }],
    default: [{ hex: "#FDFBF7", name: "Ivory Silk" }, { hex: "#D2B48C", name: "Warm Tan" }, { hex: "#2C2C2C", name: "Charcoal" }, { hex: "#B76E79", name: "Rose Gold" }],
  },
  cool: {
    spring: [{ hex: "#F0F8FF", name: "Alice Blue" }, { hex: "#B0C4DE", name: "Steel Blue" }, { hex: "#6A5ACD", name: "Slate Blue" }, { hex: "#DDA0DD", name: "Plum" }],
    summer: [{ hex: "#E6E6FA", name: "Lavender" }, { hex: "#87CEEB", name: "Sky Blue" }, { hex: "#4682B4", name: "Steel" }, { hex: "#778899", name: "Slate" }],
    autumn: [{ hex: "#D8BFD8", name: "Thistle" }, { hex: "#8B668B", name: "Plum" }, { hex: "#483D8B", name: "Dark Slate" }, { hex: "#2F4F4F", name: "Teal" }],
    winter: [{ hex: "#F8F8FF", name: "Ghost White" }, { hex: "#708090", name: "Slate Grey" }, { hex: "#191970", name: "Midnight" }, { hex: "#800020", name: "Burgundy" }],
    default: [{ hex: "#F0F8FF", name: "Ice Blue" }, { hex: "#B0C4DE", name: "Steel" }, { hex: "#483D8B", name: "Slate Blue" }, { hex: "#2C2C2C", name: "Charcoal" }],
  },
  neutral: {
    spring: [{ hex: "#FAEBD7", name: "Antique White" }, { hex: "#D2B48C", name: "Tan" }, { hex: "#BC8F8F", name: "Rosy Brown" }, { hex: "#696969", name: "Dim Grey" }],
    summer: [{ hex: "#F5F5DC", name: "Beige" }, { hex: "#C4AEAD", name: "Dusty Rose" }, { hex: "#808080", name: "Grey" }, { hex: "#DCDCDC", name: "Gainsboro" }],
    autumn: [{ hex: "#F5F5DC", name: "Beige" }, { hex: "#A0522D", name: "Sienna" }, { hex: "#556B2F", name: "Olive" }, { hex: "#6B4423", name: "Walnut" }],
    winter: [{ hex: "#FFFAFA", name: "Snow" }, { hex: "#B0B0B0", name: "Silver" }, { hex: "#2C2C2C", name: "Charcoal" }, { hex: "#800020", name: "Burgundy" }],
    default: [{ hex: "#FDFBF7", name: "Ivory" }, { hex: "#D2B48C", name: "Tan" }, { hex: "#808080", name: "Grey" }, { hex: "#2C2C2C", name: "Charcoal" }],
  },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOutfitForProfile(profile: ProfileData) {
  const bodyType = profile.bodyType || "hourglass";
  const style = (profile.stylePreferences || "").toLowerCase().trim();
  const season = profile.season || "default";
  const undertone = profile.undertone || "neutral";
  const skinTone = profile.skinTone || "medium";
  const occasion = profile.occasion || "everyday outing";
  const genderInput = (profile.gender || "").toLowerCase().trim();
  const name = profile.name || "you";

  const isMale = ["male", "man", "boy", "masculine"].some(g => genderInput.includes(g));

  // Determine the closest style key
  let styleKey = "default";
  if (style.includes("minim")) styleKey = "minimalist";
  else if (style.includes("boho") || style.includes("bohemian")) styleKey = "boho";
  else if (style.includes("street")) styleKey = "streetwear";
  else if (style.includes("classic") || style.includes("formal") || style.includes("elegant")) styleKey = "classic";

  let top, bottom, footwear, accessories, finishingTouches;
  let finishingTouchesLabel = isMale ? "Grooming" : "Makeup";

  if (isMale) {
    // Map female body types to male equivalents if needed
    let maleBodyType = bodyType;
    if (bodyType === "hourglass") maleBodyType = "inverted_triangle";
    if (bodyType === "pear") maleBodyType = "triangle";
    if (bodyType === "apple") maleBodyType = "oval";

    const bodyTops = MALE_TOPS[maleBodyType] || MALE_TOPS["inverted_triangle"];
    top = pick(bodyTops[styleKey] || bodyTops["default"]);

    const bodyBottoms = MALE_BOTTOMS[maleBodyType] || MALE_BOTTOMS["inverted_triangle"];
    bottom = pick(bodyBottoms[styleKey] || bodyBottoms["default"]);

    footwear = pick(MALE_FOOTWEAR[season] || MALE_FOOTWEAR["default"]);
    accessories = pick(MALE_ACCESSORIES[undertone] || MALE_ACCESSORIES["neutral"]);
    
    const groomingByUndertone = MALE_GROOMING[undertone] || MALE_GROOMING["neutral"];
    finishingTouches = groomingByUndertone[skinTone] || groomingByUndertone["medium"];
  } else {
    const bodyTops = TOPS[bodyType] || TOPS["hourglass"];
    top = pick(bodyTops[styleKey] || bodyTops["default"]);

    const bodyBottoms = BOTTOMS[bodyType] || BOTTOMS["hourglass"];
    bottom = pick(bodyBottoms[styleKey] || bodyBottoms["default"]);

    footwear = pick(FOOTWEAR[season] || FOOTWEAR["default"]);
    accessories = pick(ACCESSORIES[undertone] || ACCESSORIES["neutral"]);
    
    const makeupByUndertone = MAKEUP[undertone] || MAKEUP["neutral"];
    finishingTouches = makeupByUndertone[skinTone] || makeupByUndertone["medium"];
  }

  // Pick color palette
  const paletteByUndertone = PALETTES[undertone] || PALETTES["neutral"];
  const palette = paletteByUndertone[season] || paletteByUndertone["default"];

  // Build explanation
  const bodyTypeNames: Record<string, string> = isMale ? {
    inverted_triangle: "broad-shouldered frame",
    rectangle: "athletic, straight build",
    oval: "sturdy, central-weighted build",
    triangle: "sturdy lower-body frame",
  } : {
    hourglass: "hourglass silhouette",
    pear: "pear-shaped figure",
    apple: "apple-shaped frame",
    rectangle: "straight, athletic frame",
    inverted_triangle: "inverted triangle build",
  };
  
  const mappedBodyType = isMale ? (
    bodyType === "hourglass" ? "inverted_triangle" :
    bodyType === "pear" ? "triangle" :
    bodyType === "apple" ? "oval" : bodyType
  ) : bodyType;

  const bodyDesc = bodyTypeNames[mappedBodyType] || "unique build";
  const undertoneAdj = undertone === "warm" ? "warm" : undertone === "cool" ? "cool" : "balanced";

  const explanation = `Designed specifically for your ${bodyDesc} with ${undertoneAdj} undertones and ${skinTone} skin tone. ${
    isMale ? (
      mappedBodyType === "inverted_triangle"
        ? "The structured top emphasizes your broad shoulders while the tailored bottom balances your proportions perfectly."
        : mappedBodyType === "rectangle"
        ? "The layered top adds dimension and structure to your frame, paired with clean-cut trousers for a sharp, modern silhouette."
        : mappedBodyType === "oval"
        ? "The relaxed, structured overshirt creates clean vertical lines, while the straight-leg trousers provide a comfortable, elongating fit."
        : "The tailored jacket builds structure up top, perfectly complementing the tailored dark trousers for a balanced look."
    ) : (
      bodyType === "hourglass"
        ? "The fitted top highlights your defined waist while the bottom creates a long, elegant line."
        : bodyType === "pear"
        ? "The detailed top draws attention upward, creating visual balance, while the dark, streamlined bottom elongates your lower half."
        : bodyType === "apple"
        ? "The flowing silhouette skims your midsection beautifully, while the structured bottom creates a clean line and balanced proportions."
        : bodyType === "rectangle"
        ? "The waist-defining pieces create gorgeous curves, while texture and detail add dimension to your naturally sleek frame."
        : "The simple, elegant top keeps focus balanced while the bold bottom adds volume and proportion to your lower half."
    )
  } The color palette is curated to complement your ${undertoneAdj} undertones and make your ${skinTone} skin glow. Perfect for ${occasion}${season !== "default" ? ` during ${season}` : ""}.`;

  const affirmations = [
    `${name}, you are a masterpiece. Step into the room knowing this look was crafted just for your unique style.`,
    `Confidence is the best accessory, ${name}. Wear this look and own every moment.`,
    `${name}, style is a way to say who you are without having to speak. Let this look tell your story.`,
    `This outfit was made for someone extraordinary — and that someone is you, ${name}.`,
    `${name}, you don't just wear fashion — fashion wears you.`,
  ];

  return {
    outfit: { top, bottom, footwear, accessories, finishingTouches, finishingTouchesLabel },
    palette,
    explanation,
    affirmation: pick(affirmations),
    gender: isMale ? "male" : "female",
    styleKey,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profile = body.profile as ProfileData;

    // Small delay for a nice loading UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = generateOutfitForProfile(profile);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Outfit generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate outfit" },
      { status: 500 }
    );
  }
}
