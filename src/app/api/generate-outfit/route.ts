import { NextResponse } from "next";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate API delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock response following the prompt requirements
    const mockResponse = {
      outfit: {
        top: "A luxurious silk slip camisole with a delicate cowl neck",
        bottom: "High-waisted, wide-leg linen trousers with sharp pleats",
        footwear: "Minimalist strappy leather sandals with a modest block heel",
        accessories: [
          "A structured mini top-handle bag in embossed croc",
          "Layered delicate gold chains",
          "Oversized tortoiseshell sunglasses"
        ],
        makeup: "Dewy skin finish with a soft peach blush and a warm nude lip tint."
      },
      palette: [
        { hex: "#FDFBF7", name: "Ivory Silk" },
        { hex: "#D2B48C", name: "Warm Tan" },
        { hex: "#2C2C2C", name: "Charcoal" },
        { hex: "#B76E79", name: "Rose Gold Accent" }
      ],
      explanation: "Given your hourglass silhouette and warm undertones, this ensemble creates a beautiful balance. The slip top skims your curves delicately while the wide-leg trousers cinch at your natural waist, elongating your legs. The warm tan and ivory tones perfectly complement your skin, bringing out a natural radiance, while the rose gold accessories add a touch of modern luxury suitable for your occasion.",
      affirmation: "You are a masterpiece. Step into the room knowing this look was crafted just for your unique beauty."
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate outfit" }, { status: 500 });
  }
}
