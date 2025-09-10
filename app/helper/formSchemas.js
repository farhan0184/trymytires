import { z } from "zod";

export const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string(),
  brand: z.string(),
  Type: z.string().optional(),
  Style: z.string().optional(),
  size: z.string().optional(),
  model_year: z.string().optional(),
  ship_weight: z.number().optional(),
  stock: z.number().optional(),
  price: z.number().min(0),
  discount_type: z.enum(["flat", "percentage"]).optional(),
  discount_value: z.number().optional(),
  availability: z.boolean().optional(),
  value_buys: z.boolean().optional(),
  description: z.record(z.string()).optional(),
  thumbnail_image: z.any().optional(),
  images: z.any().optional(),
});

export const tiresSchema = baseSchema.extend({
  season: z.string().optional(),
  speed_rating: z.string().optional(),
  ply: z.string().optional(),
  performance: z.string().optional(),
  side_wall: z.string().optional(),
  rim_diameter: z.number().optional(),
  run_flat: z.string().optional(),
  load: z.number().optional(),
  mileage_warrranty: z.number().optional(),
  UTQG: z.string().optional(),
  load_range: z.string().optional(),
  max_load_single: z.string().optional(),
  rim_width_max: z.number().optional(),
  rim_width_min: z.number().optional(),
  rpm: z.number().optional(),
  tread_depth: z.number().optional(),
  season_designation: z.string().optional(),
});

export const wheelsSchema = baseSchema.extend({
  lugs_type: z.string().optional(),
  finish: z.string().optional(),
  lug: z.number().optional(),
  bolt_circle1: z.number().optional(),
  bolt_circle2: z.number().optional(),
  offset: z.number().optional(),
  hub_bore: z.number().optional(),
  material: z.string().optional(),
  back_spacing: z.number().optional(),
  load_rating: z.number().optional(),
  width: z.number().optional(),
  season_designation: z.string().optional(),
});

export const getSchemaByCategory = (category) => {
  switch (category) {
    case "Tires":
      return tiresSchema;
    case "Wheels":
      return wheelsSchema;
    default:
      return baseSchema;
  }
}; 