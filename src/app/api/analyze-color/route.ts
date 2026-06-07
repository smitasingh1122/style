import { NextResponse } from "next/server";

type ColorAnalysisResult = {
  season: string;
  subSeason: string;
  description: string;
  characteristics: string[];
  bestColors: { hex: string; name: string }[];
  avoidColors: { hex: string; name: string }[];
  metalRecommendation: string;
  tips: string[];
};

// Seasonal color analysis database
const SEASONS: Record<string, {
  description: string;
  characteristics: string[];
  bestColors: { hex: string; name: string }[];
  avoidColors: { hex: string; name: string }[];
  metalRecommendation: string;
  tips: string[];
}> = {
  "True Spring": {
    description: "Your complexion radiates warmth with a clear, bright quality. You have a natural golden glow that comes alive with warm, vivid colors — think sun-drenched meadows and fresh blooms.",
    characteristics: ["Warm undertone with golden or peachy hue", "Clear, bright complexion", "Hair often has golden or strawberry highlights", "Eyes may be warm green, hazel, or warm blue"],
    bestColors: [
      { hex: "#FF6347", name: "Tomato Red" },
      { hex: "#FF8C00", name: "Tangerine" },
      { hex: "#FFD700", name: "Sunflower" },
      { hex: "#32CD32", name: "Lime Green" },
      { hex: "#FF69B4", name: "Coral Pink" },
    ],
    avoidColors: [
      { hex: "#000000", name: "True Black" },
      { hex: "#4B0082", name: "Deep Purple" },
      { hex: "#708090", name: "Cool Grey" },
    ],
    metalRecommendation: "Gold, brass, and warm copper jewelry will complement your warmth beautifully.",
    tips: ["Choose clear, warm colors over muted tones", "Avoid anything too icy or cool-toned", "Your best neutrals are warm beige, camel, and ivory"],
  },
  "Light Spring": {
    description: "You have a delicate, luminous quality with warm undertones that glow in soft, pastel-leaning warm colors. Think of the first gentle rays of spring morning light.",
    characteristics: ["Light, warm undertone", "Fair to light-medium complexion", "Often has light brown or blonde hair", "Eyes are typically light — blue, green, or light hazel"],
    bestColors: [
      { hex: "#FFDAB9", name: "Peach" },
      { hex: "#87CEEB", name: "Light Sky" },
      { hex: "#98FB98", name: "Mint Green" },
      { hex: "#FFB6C1", name: "Light Pink" },
      { hex: "#F0E68C", name: "Soft Yellow" },
    ],
    avoidColors: [
      { hex: "#800000", name: "Maroon" },
      { hex: "#2F4F4F", name: "Dark Slate" },
      { hex: "#8B0000", name: "Dark Red" },
    ],
    metalRecommendation: "Light gold, rose gold, and delicate champagne metals suit your ethereal quality.",
    tips: ["Stick to light, warm, and delicate colors", "Avoid overly dark or saturated shades — they'll overpower you", "Soft aqua and warm pastels are your secret weapons"],
  },
  "Warm Spring": {
    description: "Your warmth is unmistakable — a rich, golden quality that makes earthy and sun-kissed colors feel like second skin. You're pure sunshine.",
    characteristics: ["Strong warm undertone", "Golden, peachy, or olive-tinged skin", "Hair is usually warm brown, auburn, or golden blonde", "Eyes are warm — amber, warm brown, or hazel"],
    bestColors: [
      { hex: "#DAA520", name: "Goldenrod" },
      { hex: "#CD853F", name: "Warm Tan" },
      { hex: "#FF7F50", name: "Coral" },
      { hex: "#228B22", name: "Forest Green" },
      { hex: "#D2691E", name: "Cinnamon" },
    ],
    avoidColors: [
      { hex: "#C0C0C0", name: "Silver" },
      { hex: "#FF00FF", name: "Magenta" },
      { hex: "#E6E6FA", name: "Icy Lavender" },
    ],
    metalRecommendation: "Rich gold, bronze, and antiqued brass bring out your natural warmth.",
    tips: ["Earth tones are your best friend", "Avoid cool pinks and blue-based reds", "Rich, warm neutrals like caramel and olive work beautifully"],
  },
  "True Summer": {
    description: "You carry an elegant coolness with a soft, muted quality. Your complexion has a gentle rose or blue undertone that harmonizes with dusty, sophisticated colors — like a garden in soft afternoon shade.",
    characteristics: ["Cool undertone with a gentle, muted quality", "Skin often has a rosy or pinkish hue", "Hair is typically ash brown, mousy blonde, or soft grey", "Eyes are soft — grey-blue, soft green, or muted hazel"],
    bestColors: [
      { hex: "#B0C4DE", name: "Steel Blue" },
      { hex: "#DDA0DD", name: "Soft Plum" },
      { hex: "#BC8F8F", name: "Dusty Rose" },
      { hex: "#778899", name: "Slate" },
      { hex: "#E6E6FA", name: "Lavender" },
    ],
    avoidColors: [
      { hex: "#FF4500", name: "Bright Orange" },
      { hex: "#FFD700", name: "Bold Yellow" },
      { hex: "#8B4513", name: "Warm Brown" },
    ],
    metalRecommendation: "Silver, platinum, and white gold enhance your cool elegance.",
    tips: ["Choose muted, cool colors with a grey undertone", "Avoid anything too warm, bright, or neon", "Dusty pastels and blue-based neutrals are your signature"],
  },
  "Light Summer": {
    description: "Your complexion is ethereally cool with a soft luminosity. You look best in gentle, cool-toned pastels that echo the delicate haze of a summer morning.",
    characteristics: ["Light, cool undertone", "Very fair to light complexion with pink or blue undertone", "Hair is often light ash blonde or light brown", "Eyes are light blue, grey, or soft green"],
    bestColors: [
      { hex: "#E6E6FA", name: "Lavender" },
      { hex: "#B0E0E6", name: "Powder Blue" },
      { hex: "#D8BFD8", name: "Thistle" },
      { hex: "#FFB6C1", name: "Soft Rose" },
      { hex: "#F5F5DC", name: "Soft Beige" },
    ],
    avoidColors: [
      { hex: "#FF6347", name: "Tomato" },
      { hex: "#FF8C00", name: "Dark Orange" },
      { hex: "#000000", name: "Jet Black" },
    ],
    metalRecommendation: "Delicate silver, white gold, and pearl finishes are perfect for your light, cool palette.",
    tips: ["Think soft, cool, and airy", "Avoid bold, warm, or extremely saturated colors", "Your best white is a cool, soft white — not stark"],
  },
  "Soft Summer": {
    description: "You have a uniquely muted, cool-neutral quality. Neither strongly warm nor cool, you're the chameleon of color seasons — elegant in greyed, sophisticated mid-tones.",
    characteristics: ["Neutral-cool undertone with a muted, soft quality", "Skin can appear somewhat ashen without the right colors", "Hair is typically medium ash, soft brown, or grey-brown", "Eyes are often a blend — grey-green, soft blue-grey, or hazel"],
    bestColors: [
      { hex: "#808080", name: "Soft Grey" },
      { hex: "#BC8F8F", name: "Rosy Mauve" },
      { hex: "#708090", name: "Blue Slate" },
      { hex: "#8FBC8F", name: "Sage" },
      { hex: "#A0522D", name: "Soft Cocoa" },
    ],
    avoidColors: [
      { hex: "#FF0000", name: "Bright Red" },
      { hex: "#00FF00", name: "Neon Green" },
      { hex: "#FFFF00", name: "Bright Yellow" },
    ],
    metalRecommendation: "Brushed silver, pewter, and matte rose gold complement your understated elegance.",
    tips: ["Muted, blended tones are your power colors", "Avoid anything too vivid, bright, or stark", "Layering similar muted tones creates a stunning, cohesive look"],
  },
  "True Autumn": {
    description: "Your warm undertones and rich golden overtones categorize you as a True Autumn. You shine in rich, warm, earthy colors that reflect the changing leaves — deep terracotta, olive, and warm spice.",
    characteristics: ["Strong warm undertone with rich, earthy quality", "Golden, olive, or bronze skin tone", "Hair is often warm brown, auburn, or red", "Eyes are warm brown, amber, hazel, or warm green"],
    bestColors: [
      { hex: "#8B4513", name: "Rust" },
      { hex: "#556B2F", name: "Olive" },
      { hex: "#CD853F", name: "Terracotta" },
      { hex: "#DAA520", name: "Mustard" },
      { hex: "#800000", name: "Mahogany" },
    ],
    avoidColors: [
      { hex: "#E6E6FA", name: "Icy Lavender" },
      { hex: "#00FFFF", name: "Bright Cyan" },
      { hex: "#FF00FF", name: "Fuchsia" },
    ],
    metalRecommendation: "Antiqued gold, copper, and warm bronze are your ideal metals.",
    tips: ["Earth tones and warm, rich hues are your foundation", "Avoid cool pastels and neon colors", "Layer warm textures like suede, corduroy, and rich knits"],
  },
  "Warm Autumn": {
    description: "You radiate the deepest warmth — a rich, golden intensity that thrives in saturated, warm earth tones. Think of the richest autumn harvest colors.",
    characteristics: ["Very warm, deep undertone", "Skin is golden, bronze, or olive with a warm cast", "Hair is typically dark warm brown, auburn, or deep red", "Eyes are dark brown, warm hazel, or deep amber"],
    bestColors: [
      { hex: "#A0522D", name: "Sienna" },
      { hex: "#8B6914", name: "Dark Goldenrod" },
      { hex: "#6B4423", name: "Walnut" },
      { hex: "#556B2F", name: "Dark Olive" },
      { hex: "#B8860B", name: "Dark Gold" },
    ],
    avoidColors: [
      { hex: "#ADD8E6", name: "Light Blue" },
      { hex: "#FF69B4", name: "Hot Pink" },
      { hex: "#C0C0C0", name: "Cool Silver" },
    ],
    metalRecommendation: "Rich burnished gold, copper, and aged brass are your signature metals.",
    tips: ["Go for deep, saturated warm tones", "Avoid pastels, cool blues, and anything icy", "Your best neutral is a deep, warm chocolate brown"],
  },
  "Deep Autumn": {
    description: "You combine warmth with depth — a striking, dramatic quality that comes alive in rich, dark, warm colors. Think of a twilight autumn forest.",
    characteristics: ["Warm-neutral with significant depth", "Medium to deep skin with warm undertones", "Hair is typically very dark brown or black with warm tones", "Eyes are deep brown, dark hazel, or warm black"],
    bestColors: [
      { hex: "#8B0000", name: "Deep Red" },
      { hex: "#2F4F2F", name: "Dark Forest" },
      { hex: "#8B4513", name: "Saddle Brown" },
      { hex: "#4B0082", name: "Aubergine" },
      { hex: "#191970", name: "Dark Navy" },
    ],
    avoidColors: [
      { hex: "#FFDAB9", name: "Peach Puff" },
      { hex: "#E6E6FA", name: "Lavender" },
      { hex: "#98FB98", name: "Pale Green" },
    ],
    metalRecommendation: "Dark antiqued gold, deep bronze, and blackened copper suit your dramatic depth.",
    tips: ["Rich, dark, warm colors are your power palette", "Avoid anything too light, pastel, or cool-toned", "Dark teal and burgundy are stunning statement colors for you"],
  },
  "True Winter": {
    description: "You have a striking, high-contrast look with cool undertones. You come alive in bold, clear, icy colors — the drama of fresh snowfall against a midnight sky.",
    characteristics: ["Cool undertone with high contrast", "Skin is very fair or deep with blue/pink undertone", "Hair is typically dark — black, dark brown, or platinum", "Eyes are striking — dark brown, icy blue, or cool green"],
    bestColors: [
      { hex: "#FF0000", name: "True Red" },
      { hex: "#000000", name: "Black" },
      { hex: "#FFFFFF", name: "Pure White" },
      { hex: "#0000CD", name: "Royal Blue" },
      { hex: "#FF00FF", name: "Magenta" },
    ],
    avoidColors: [
      { hex: "#F5DEB3", name: "Wheat" },
      { hex: "#D2B48C", name: "Warm Tan" },
      { hex: "#CD853F", name: "Peru" },
    ],
    metalRecommendation: "High-shine silver, platinum, and white gold match your bold contrast.",
    tips: ["Bold, clear, icy colors are your power moves", "Avoid anything muted, dusty, or warm-toned", "High contrast is your friend — pair black and white fearlessly"],
  },
  "Cool Winter": {
    description: "You embody the essence of cool sophistication. Your porcelain or deep complexion with blue undertones pairs perfectly with icy, jewel-toned hues.",
    characteristics: ["Strongly cool undertone", "Skin is fair to deep with blue or pink undertone", "Hair is typically dark and cool — ash black, dark brown", "Eyes are cool-toned — grey, blue, or dark brown"],
    bestColors: [
      { hex: "#4169E1", name: "Royal Blue" },
      { hex: "#800080", name: "Purple" },
      { hex: "#008B8B", name: "Teal" },
      { hex: "#DC143C", name: "Crimson" },
      { hex: "#F0F8FF", name: "Ice Blue" },
    ],
    avoidColors: [
      { hex: "#FF8C00", name: "Orange" },
      { hex: "#DAA520", name: "Goldenrod" },
      { hex: "#556B2F", name: "Olive" },
    ],
    metalRecommendation: "Polished silver, white gold, and platinum are ideal for your cool elegance.",
    tips: ["Jewel tones and icy hues are your sweet spot", "Avoid warm earth tones and golden hues", "Navy and emerald are universally stunning on you"],
  },
  "Deep Winter": {
    description: "You carry immense depth and drama — a cool richness that commands attention in saturated, deep jewel tones and stark contrasts.",
    characteristics: ["Cool-neutral with extreme depth", "Medium to very deep skin with cool or neutral undertone", "Hair is very dark, often jet black", "Eyes are deep and intense — dark brown or black"],
    bestColors: [
      { hex: "#191970", name: "Midnight Blue" },
      { hex: "#8B008B", name: "Dark Magenta" },
      { hex: "#006400", name: "Dark Green" },
      { hex: "#8B0000", name: "Dark Red" },
      { hex: "#000000", name: "Jet Black" },
    ],
    avoidColors: [
      { hex: "#FFDAB9", name: "Peach" },
      { hex: "#F0E68C", name: "Khaki" },
      { hex: "#FFD700", name: "Gold" },
    ],
    metalRecommendation: "Gunmetal, dark silver, and polished steel complement your dramatic depth.",
    tips: ["The darkest, richest cool jewel tones are your domain", "Avoid warm pastels and light, muted colors", "Stark black and white is your ultimate power combination"],
  },
};

// Analyze RGB values to determine skin undertone and season
function analyzeColors(avgR: number, avgG: number, avgB: number, dominantHue: number, saturation: number, lightness: number): ColorAnalysisResult {
  // Determine warmth: warm skins have higher R relative to B
  const warmth = (avgR - avgB) / 255;
  // Determine depth: how light or dark the skin is
  const depth = lightness;
  // Determine clarity: how saturated the skin color is
  const clarity = saturation;

  let season: string;

  if (warmth > 0.12) {
    // WARM — Spring or Autumn
    if (depth > 0.65) {
      season = clarity > 0.3 ? "Light Spring" : "Light Spring";
    } else if (depth > 0.45) {
      season = clarity > 0.35 ? "True Spring" : "Warm Autumn";
    } else if (depth > 0.3) {
      season = clarity > 0.3 ? "Warm Spring" : "True Autumn";
    } else {
      season = clarity > 0.25 ? "Deep Autumn" : "Warm Autumn";
    }
  } else if (warmth > 0.03) {
    // NEUTRAL-WARM
    if (depth > 0.6) {
      season = "Light Spring";
    } else if (depth > 0.4) {
      season = clarity > 0.3 ? "True Autumn" : "Soft Summer";
    } else {
      season = "Deep Autumn";
    }
  } else if (warmth > -0.03) {
    // NEUTRAL
    if (depth > 0.6) {
      season = "Light Summer";
    } else if (depth > 0.4) {
      season = "Soft Summer";
    } else {
      season = "Deep Winter";
    }
  } else {
    // COOL — Summer or Winter
    if (depth > 0.65) {
      season = clarity > 0.3 ? "Light Summer" : "Light Summer";
    } else if (depth > 0.45) {
      season = clarity > 0.35 ? "True Winter" : "True Summer";
    } else if (depth > 0.3) {
      season = clarity > 0.3 ? "Cool Winter" : "True Summer";
    } else {
      season = clarity > 0.25 ? "Deep Winter" : "Cool Winter";
    }
  }

  const data = SEASONS[season];

  return {
    season,
    subSeason: season.split(" ")[0],
    description: data.description,
    characteristics: data.characteristics,
    bestColors: data.bestColors,
    avoidColors: data.avoidColors,
    metalRecommendation: data.metalRecommendation,
    tips: data.tips,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageData } = body;

    if (!imageData) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Decode base64 image data — the imageData is an array of [r, g, b, a, ...] pixel values
    const pixels: number[] = imageData;
    
    let totalR = 0, totalG = 0, totalB = 0;
    let skinPixelCount = 0;

    // Sample every 4th pixel for performance (pixels come as flat RGBA array)
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Simple skin-tone detection heuristic (works across many skin tones)
      // Rule: R > 60, G > 40, B > 20, R > G, R > B, |R-G| > 15, max-min < 200
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      
      if (
        r > 60 && g > 40 && b > 20 &&
        r > g && r > b &&
        (r - g) > 10 &&
        (maxC - minC) < 200 &&
        maxC > 80
      ) {
        totalR += r;
        totalG += g;
        totalB += b;
        skinPixelCount++;
      }
    }

    if (skinPixelCount < 50) {
      // Not enough skin detected, use all pixels as fallback
      for (let i = 0; i < pixels.length; i += 16) {
        totalR += pixels[i];
        totalG += pixels[i + 1];
        totalB += pixels[i + 2];
        skinPixelCount++;
      }
    }

    const avgR = totalR / skinPixelCount;
    const avgG = totalG / skinPixelCount;
    const avgB = totalB / skinPixelCount;

    // Convert to HSL for more nuanced analysis
    const r01 = avgR / 255;
    const g01 = avgG / 255;
    const b01 = avgB / 255;
    const max = Math.max(r01, g01, b01);
    const min = Math.min(r01, g01, b01);
    const lightness = (max + min) / 2;
    let saturation = 0;
    let hue = 0;

    if (max !== min) {
      const d = max - min;
      saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r01) hue = ((g01 - b01) / d + (g01 < b01 ? 6 : 0)) / 6;
      else if (max === g01) hue = ((b01 - r01) / d + 2) / 6;
      else hue = ((r01 - g01) / d + 4) / 6;
    }

    const result = analyzeColors(avgR, avgG, avgB, hue * 360, saturation, lightness);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Color analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze colors" },
      { status: 500 }
    );
  }
}
