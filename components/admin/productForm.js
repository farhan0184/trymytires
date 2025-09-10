"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "../ui/form";
import CustomInput from "../commons/CustomForm2";
import {
  fetchProductBrands,
  fetchProductCategories,
  fetchProductFinish,
  fetchProductLugs,
  fetchProductPly,
  fetchProductPerformances,
  fetchProductSeasons,
  fetchProductSeasonalDesignations,
  fetchProductSidewalls,
  fetchProductSpeedRatings,
  fetchProductStyles,
  fetchProductTypes,
  fetchLanguages,
  createProduct,
  updateProduct,
  postMultipleImage,
  postSingleImage,
} from "@/app/helper/backend";

import { handleImageUpload } from "@/app/helper/helper";
import { handleApiRequest } from "@/app/helper/formfunction";
import toast from "react-hot-toast";

// Memoized schema creation to avoid recreation on every render
const createSchemas = () => {
  const baseSchema = z.object({
    productId: z.string().optional(),
    item: z.string().optional(),
    name: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Category is required"),
    type: z.string().nullable(),
    availability: z.boolean().default(true),
    value_buys: z.boolean().default(true),
    model_year: z.string().optional(),
    description: z.record(z.string()).optional(),
    price: z.coerce.number().positive("Price must be greater than 0"),
    discount: z.coerce.number().min(0, "Discount cannot be negative").optional(),
    discount_type: z.enum(['flat', 'percentage']).default('flat'),
    // discount_price: z.number().min(0, "Discount price must be positive").default(0),
    stock: z.coerce.number().min(0, "Stock cannot be negative").optional(),
    thumbnail_image: z.any().optional(),
    images: z.any().optional(),
    status: z.boolean().default(true),
    ship_weight: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    brand: z.string().nullable(),
    size: z.string().optional(),
  });

  const commonTireWheelFields = {

    style: z.string().nullable(),
  };

  const tiresSchema = baseSchema.extend({
    ...commonTireWheelFields,
    season_designation: z.string().nullable(),
    season: z.string().nullable(),
    speed_rating: z.string().nullable(),
    ply: z.string().nullable(),
    rim_diameter: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    run_flat: z.string().nullable(),
    performance: z.string().nullable(),
    side_wall: z.string().nullable(),
    load: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    mileage_warrranty: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    UTQG: z.string().nullable(),
    load_range: z.string().nullable(),
    max_load_single: z.string().nullable(),
    rim_width_max: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    rim_width_min: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    rpm: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    tread_depth: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    asymmetrical: z.string().optional().nullable(),
    directional: z.string().optional().nullable(),
    extended_mobility: z.string().optional().nullable(),
    studdable: z.string().optional().nullable(),
  });

  const wheelsSchema = baseSchema.extend({
    ...commonTireWheelFields,
    lugs_type: z.string().nullable(),
    lug: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    bolt_circle1: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    bolt_circle2: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    cap_part: z.string().optional().nullable(),
    finish: z.string().nullable(),
    offset: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    hub_bore: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    material: z.string().optional(),
    back_spacing: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    load_rating: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    width: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    ),
    hubcentric: z.string().optional().nullable(),
    hubcentric_ring_included: z.string().optional().nullable(),
  });

  return { baseSchema, tiresSchema, wheelsSchema };
};

// Memoized schemas
const SCHEMAS = createSchemas();

const getSchemaByCategory = (category) => {
  switch (category) {
    case "Tires":
      return SCHEMAS.tiresSchema;
    case "Wheels":
      return SCHEMAS.wheelsSchema;
    case "Accessories":
      return SCHEMAS.baseSchema;
    default:
      return SCHEMAS.baseSchema;
  }
};

// Memoized option transformers
const transformToSelectOptions = (items) =>
  items.map((item) => ({ value: item._id, label: item.name }));

export default function ProductForm({ defaultValues = {} }) {
  const [languages, setLanguages] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState(false);

  // Initialize category from defaultValues or fallback
  const initialCategory = defaultValues?.category?._id ?
    defaultValues.category.name :
    (defaultValues?.category || "Tires");

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [options, setOptions] = useState({
    categories: [],
    brands: [],
    types: [],
    seasons: [],
    speedRatings: [],
    ply: [],
    performances: [],
    sidewalls: [],
    lugs: [],
    finishes: [],
    seasonalDesignations: [],
    styles: [],
  });

  // Memoized schema based on category
  const formSchema = useMemo(() => getSchemaByCategory(selectedCategory), [selectedCategory]);

  // Memoized default values to prevent recreation
  const defaultFormValues = useMemo(() => {
    // Helper function to safely get option ID
    const getOptionId = (option) => option?._id || option || null;

    // Helper function to process images
    const processImages = (images) => {
      if (!images) return [];
      if (Array.isArray(images)) {
        return images.map(img => typeof img === "string" ? { url: img } : img);
      }
      return [{ url: images }];
    };

    return {
      productId: defaultValues?.productId || "",
      item: defaultValues?.item || "",
      name: defaultValues?.name || "",
      category: getOptionId(defaultValues?.category),
      type: getOptionId(defaultValues?.type),
      availability: defaultValues?.availability ?? true,
      value_buys: defaultValues?.value_buys ?? true,
      model_year: defaultValues?.model_year || "",
      description: defaultValues?.description || {},
      price: defaultValues?.price || 0,
      discount_value: defaultValues?.discount_value || 0,
      discount_type: defaultValues?.discount_type || "flat",
      // discount_price: defaultValues?.discount_price || 0,
      stock: defaultValues?.stock || 0,
      thumbnail_image: processImages(defaultValues?.thumbnail_image),
      images: processImages(defaultValues?.images),
      status: defaultValues?.status ?? true,
      ship_weight: defaultValues?.ship_weight || "",
      brand: getOptionId(defaultValues?.brand),

      // Tires-specific fields
      season: getOptionId(defaultValues?.season),
      speed_rating: getOptionId(defaultValues?.speed_rating),
      ply: getOptionId(defaultValues?.ply),
      rim_diameter: defaultValues?.rim_diameter || "",
      run_flat: defaultValues?.run_flat || "",
      performance: getOptionId(defaultValues?.performance),
      side_wall: getOptionId(defaultValues?.side_wall),
      load: defaultValues?.load || "",
      mileage_warrranty: defaultValues?.mileage_warrranty || "",
      UTQG: defaultValues?.UTQG || "",
      load_range: defaultValues?.load_range || "",
      max_load_single: defaultValues?.max_load_single || "",
      rim_width_max: defaultValues?.rim_width_max || "",
      rim_width_min: defaultValues?.rim_width_min || "",
      rpm: defaultValues?.rpm || "",
      tread_depth: defaultValues?.tread_depth || "",
      season_designation: getOptionId(defaultValues?.season_designation),
      asymmetrical: defaultValues?.asymmetrical || "",
      directional: defaultValues?.directional || "",
      extended_mobility: defaultValues?.extended_mobility || "",
      studdable: defaultValues?.studdable || "",

      // Wheels-specific fields
      lugs_type: getOptionId(defaultValues?.lugs_type),
      lug: defaultValues?.lug || "",
      bolt_circle1: defaultValues?.bolt_circle1 || "",
      bolt_circle2: defaultValues?.bolt_circle2 || "",
      finish: getOptionId(defaultValues?.finish),
      offset: defaultValues?.offset || "",
      hub_bore: defaultValues?.hub_bore || "",
      material: defaultValues?.material || "",
      cap_part: defaultValues?.cap_part || "",
      back_spacing: defaultValues?.back_spacing || 0,
      load_rating: defaultValues?.load_rating || 0,
      width: defaultValues?.width || 0,
      hubcentric: defaultValues?.hubcentric || "",
    hubcentric_ring_included: defaultValues?.hubcentric_ring_included || "",

      // Common for Tires and Wheels

      style: getOptionId(defaultValues?.style),
      size: defaultValues?.size || "",
    };
  }, [defaultValues]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });


  const watchedCategoryId = form.watch("category");
  const watchedCategoryName = useMemo(() => {
    const categoryObj = options.categories.find(cat => cat._id === watchedCategoryId);
    return categoryObj?.name || "";
  }, [watchedCategoryId, options.categories]);

  // Watch category changes with useMemo for performance
  useEffect(() => {
    if (watchedCategoryName && watchedCategoryName !== selectedCategory) {
      setSelectedCategory(watchedCategoryName);
      const newSchema = getSchemaByCategory(watchedCategoryName);
      form.reset(form.getValues(), { keepErrors: false });
      form.resolver = zodResolver(newSchema); // instead of touching private _resolver
    }
  }, [watchedCategoryName]);

  // Optimized category change handler
  useEffect(() => {
    if (watchedCategoryName && watchedCategoryName !== selectedCategory) {
      setSelectedCategory(watchedCategoryName);

      // Update resolver without full form reset
      const newSchema = getSchemaByCategory(watchedCategoryName);
      form._resolver = zodResolver(newSchema);
      form.clearErrors();
    }
  }, [watchedCategoryName, selectedCategory, form]);
  const years = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => {
    const year = 2026 - i;
    return { label: year.toString(), value: year.toString() };
  });

  // Optimized API loading with error handling and loading state
  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      try {
        const requests = [
          fetchProductCategories({ page: 1, limit: 100 }),
          fetchProductBrands({ page: 1, limit: 100 }),
          fetchProductTypes({ page: 1, limit: 100 }),
          fetchProductSeasons({ page: 1, limit: 100 }),
          fetchProductSpeedRatings({ page: 1, limit: 100 }),
          fetchProductPly({ page: 1, limit: 100 }),
          fetchProductPerformances({ page: 1, limit: 100 }),
          fetchProductSidewalls({ page: 1, limit: 100 }),
          fetchProductLugs({ page: 1, limit: 100 }),
          fetchProductFinish({ page: 1, limit: 100 }),
          fetchProductSeasonalDesignations({ page: 1, limit: 100 }),
          fetchProductStyles({ page: 1, limit: 100 }),
          fetchLanguages({ page: 1, limit: 100 }),
        ];

        const results = await Promise.all(requests);

        if (!isMounted) return;

        const [
          categoriesRes, brandsRes, typesRes, seasonsRes, speedRatingsRes,
          plyRes, performancesRes, sidewallsRes, lugsRes, finishesRes,
          seasonalDesignationsRes, stylesRes, languagesRes
        ] = results;

        // Batch state updates
        setOptions({
          categories: categoriesRes?.data?.docs || [],
          brands: brandsRes?.data?.docs || [],
          types: typesRes?.data?.docs || [],
          seasons: seasonsRes?.data?.docs || [],
          speedRatings: speedRatingsRes?.data?.docs || [],
          ply: plyRes?.data?.docs || [],
          performances: performancesRes?.data?.docs || [],
          sidewalls: sidewallsRes?.data?.docs || [],
          lugs: lugsRes?.data?.docs || [],
          finishes: finishesRes?.data?.docs || [],
          seasonalDesignations: seasonalDesignationsRes?.data?.docs || [],
          styles: stylesRes?.data?.docs || [],
        });

        setLanguages(languagesRes?.data || []);
      } catch (error) {

        toast.error("Error loading options", error)
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Optimized description initialization
  useEffect(() => {
    if (languages.length > 0) {
      const currentDesc = form.getValues("description") || {};
      const newDesc = { ...currentDesc };
      let hasChanges = false;

      // Only update if there are missing language codes
      for (const lang of languages) {
        if (!(lang.code in newDesc)) {
          newDesc[lang.code] = "";
          hasChanges = true;
        }
      }

      if (hasChanges) {
        form.setValue("description", newDesc);
      }
    }
  }, [languages, form]);

  const normalizeValues = (values) => {
    Object.keys(values).forEach((key) => {
      if (values[key] === "") values[key] = null;
    });
    return values;
  };

  // Memoized submit handler
  const onSubmit = useCallback(async (values) => {

    values = normalizeValues(values);



    values.images = await handleImageUpload(values.images, false);
    values.thumbnail_image = await handleImageUpload(values.thumbnail_image, true);

    // Add ID for updates
    if (defaultValues?.productId) {
      values._id = defaultValues._id;
    }

    const isUpdate = defaultValues?.productId && defaultValues?.productId !== "";

 

    await handleApiRequest({
      apiFunc: isUpdate ? updateProduct : createProduct,
      payload: {
        ...values,
        price: Number(values.price),
        discount: Number(values.discount),
        stock: Number(values.stock)
      },
      setLoading: setBtnLoading,
      onSuccess: () => {
        window.location.href = "/admin/product_section";
      },

    });
  }, [defaultValues]);

  // Memoized toggle handler
  const toggleDescriptions = useCallback(() => {
    setShowDescriptions(prev => !prev);
  }, []);

  // Memoized discount type options


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-4xl mx-auto"
      >
        {/* Debug Button - Remove in production
        <div className="bg-red-50 p-4 rounded-lg">
          <Button
            type="button"
            variant="outline"
            onClick={debugFormState}
            className="mr-4"
          >
            Debug Form State
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => console.log("Manual form values:", form.getValues())}
          >
            Log Current Values
          </Button>
        </div> */}

        {/* Image Upload Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Product Images</h3>
          <div className="flex gap-6 flex-wrap">
            <CustomInput
              form={form}
              name="thumbnail_image"
              title="Thumbnail Image"
              variant="image"
              max={1}
            />
            <CustomInput
              form={form}
              name="images"
              title="Product Images"
              variant="image"
              max={3}
            />
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="space-y-4">
            <CustomInput
              form={form}
              name="name"
              title="Product Name"
              placeholder="Enter product name"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CustomInput
                form={form}
                name="category"
                title="Category"
                placeholder="Select category"
                variant="select"
                options={options.categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
              />

              {/* Show Brand for all categories */}
              <CustomInput
                form={form}
                name="brand"
                title="Brand"
                variant="select"
                options={options.brands.map((b) => ({
                  value: b._id,
                  label: b.name,
                }))}
                placeholder="Select brand"
              />

              <CustomInput
                form={form}
                name="type"
                title="Type"
                variant="select"
                options={options.types.map((t) => ({
                  value: t._id,
                  label: t.name,
                }))}
                placeholder="Select type"
              />

              {/* Show Style for Tires and Wheels only */}
              {(selectedCategory === "Tires" ||
                selectedCategory === "Wheels") && (
                  <CustomInput
                    form={form}
                    name="style"
                    title="Style"
                    variant="select"
                    options={options.styles.map((s) => ({
                      value: s._id,
                      label: s.name,
                    }))}
                    placeholder="Select style"
                  />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Show Size for Tires and Wheels only */}
              {/* {(selectedCategory === "Tires" ||
                selectedCategory === "Wheels") && ( */}
              <CustomInput
                form={form}
                name="size"
                title="Size"
                placeholder="Enter size"
              />
              {/* )} */}

              <CustomInput
                form={form}
                name="model_year"
                title="Model Year"
                variant="select"
                options={years.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
                placeholder="Select year"
              />

              <CustomInput
                form={form}
                name="ship_weight"
                title="Shipping Weight"
                type="number"
                placeholder="Enter weight"
              />

              <CustomInput
                form={form}
                name="stock"
                title="Stock"
                type="number"
                placeholder="Total stock"
              />
            </div>
          </div>
        </div>

        {/* Tires-Specific Fields */}
        {selectedCategory === "Tires" && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Tires Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CustomInput
                form={form}
                name="season"
                title="Season"
                variant="select"
                options={options.seasons.map((s) => ({
                  value: s._id,
                  label: s.name,
                }))}
                placeholder="Select season"
              />

              <CustomInput
                form={form}
                name="speed_rating"
                title="Speed Rating"
                variant="select"
                options={options.speedRatings.map((s) => ({
                  value: s._id,
                  label: s.name,
                }))}
                placeholder="Select speed rating"
              />

              <CustomInput
                form={form}
                name="ply"
                title="Ply"
                variant="select"
                options={options.ply.map((p) => ({
                  value: p._id,
                  label: p.name,
                }))}
                placeholder="Select ply"
              />

              <CustomInput
                form={form}
                name="performance"
                title="Performance"
                variant="select"
                options={options.performances.map((p) => ({
                  value: p._id,
                  label: p.name,
                }))}
                placeholder="Select performance"
              />

              <CustomInput
                form={form}
                name="side_wall"
                title="Side Wall"
                variant="select"
                options={options.sidewalls.map((sw) => ({
                  value: sw._id,
                  label: sw.name,
                }))}
                placeholder="Select side wall"
              />

              <CustomInput
                form={form}
                name="rim_diameter"
                title="Rim Diameter"
                type="number"
                placeholder="Rim diameter"
              />

              <CustomInput
                form={form}
                name="run_flat"
                title="Run Flat"
                placeholder="Run flat info"
              />

              <CustomInput
                form={form}
                name="load"
                title="Load"
                type="number"
                placeholder="Load"
              />

              <CustomInput
                form={form}
                name="mileage_warrranty"
                title="Mileage Warranty"
                type="number"
                placeholder="Mileage warranty"
              />

              <CustomInput
                form={form}
                name="UTQG"
                title="UTQG"
                placeholder="UTQG rating"
              />

              <CustomInput
                form={form}
                name="load_range"
                title="Load Range"
                placeholder="Load range"
              />

              <CustomInput
                form={form}
                name="max_load_single"
                title="Max Load Single"
                placeholder="Max load single"
              />

              <CustomInput
                form={form}
                name="rim_width_max"
                title="Rim Width Max"
                type="number"
                placeholder="Rim width max"
              />

              <CustomInput
                form={form}
                name="rim_width_min"
                title="Rim Width Min"
                type="number"
                placeholder="Rim width min"
              />

              <CustomInput
                form={form}
                name="rpm"
                title="RPM"
                type="number"
                placeholder="RPM"
              />

              <CustomInput
                form={form}
                name="tread_depth"
                title="Tread Depth"
                type="number"
                placeholder="Tread depth"
              />
              <CustomInput
                form={form}
                name="asymmetrical"
                title="Asymmetrical"
                type="text"
                placeholder="asymmetrical"
              />
              <CustomInput
                form={form}
                name="directional"
                title="Directional"
                type="text"
                placeholder="Directional"
              />
              <CustomInput
                form={form}
                name="extended_mobility"
                title="Extended Mobility"
                type="text"
                placeholder="Extended Mobility"
              />
              <CustomInput
                form={form}
                name="studdable"
                title="studdable"
                type="text"
                placeholder="studdable"
              />
            </div>
          </div>
        )}

        {/* Wheels-Specific Fields */}
        {selectedCategory === "Wheels" && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Wheels Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CustomInput
                form={form}
                name="lugs_type"
                title="Lugs Type"
                variant="select"
                options={options.lugs.map((l) => ({
                  value: l._id,
                  label: l.name,
                }))}
                placeholder="Select lugs type"
              />

              <CustomInput
                form={form}
                name="finish"
                title="Finish"
                variant="select"
                options={options.finishes.map((f) => ({
                  value: f._id,
                  label: f.name,
                }))}
                placeholder="Select finish"
              />

              <CustomInput
                form={form}
                name="lug"
                title="Lug Count"
                type="number"
                placeholder="Lug count"
              />

              <CustomInput
                form={form}
                name="bolt_circle1"
                title="Bolt Circle 1"
                type="number"
                placeholder="Bolt circle 1"
              />

              <CustomInput
                form={form}
                name="bolt_circle2"
                title="Bolt Circle 2"
                type="number"
                placeholder="Bolt circle 2"
              />

              <CustomInput
                form={form}
                name="offset"
                title="Offset"
                type="number"
                placeholder="Offset"
              />

              <CustomInput
                form={form}
                name="hub_bore"
                title="Hub Bore"
                type="number"
                placeholder="Hub bore"
              />

              <CustomInput
                form={form}
                name="material"
                title="Material"
                placeholder="Material"
              />
              <CustomInput
                form={form}
                name="cap_part"
                title="Cap Part"
                placeholder="Cap Part"
              />

              <CustomInput
                form={form}
                name="back_spacing"
                title="Back Spacing"
                type="number"
                placeholder="Back spacing"
              />

              <CustomInput
                form={form}
                name="load_rating"
                title="Load Rating"
                type="number"
                placeholder="Load rating"
              />

              <CustomInput
                form={form}
                name="width"
                title="Width"
                type="number"
                placeholder="Width"
              />
              
              <CustomInput
                form={form}
                name="hubcentric"
                title="Hubcentric"
                type="text"
                placeholder="Hubcentric"
              />
              <CustomInput
                form={form}
                name="hubcentric_ring_included"
                title="Hubcentric Ring Included"
                type="text"
                placeholder="Hubcentric Ring Included"
              />
              

            </div>
          </div>
        )}

        {/* Pricing Section */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Pricing & Discount</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomInput
              form={form}
              name="price"
              title="Price"
              type="number"
              placeholder="Product price"
            />

            <CustomInput
              form={form}
              name="discount_type"
              title="Discount Type"
              variant="select"
              options={[
                { value: "flat", label: "Flat" },
                { value: "percentage", label: "Percentage" },
              ]}
              placeholder="Select discount type"
            />

            <CustomInput
              form={form}
              name="discount_value"
              title="Discount Value"
              type="number"
              placeholder="Discount amount"
            />

            {/* <CustomInput
              form={form}
              name="discount_price"
              title="Discount Price"
              type="number"
              placeholder="Final discounted price"
            /> */}
          </div>
        </div>

        {/* Seasonal Designation for Tires and Wheels */}
        {(selectedCategory === "Tires" || selectedCategory === "Wheels") && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              Additional Specifications
            </h3>
            <CustomInput
              form={form}
              name="season_designation"
              title="Seasonal Designation"
              variant="select"
              options={options.seasonalDesignations.map((sd) => ({
                value: sd._id,
                label: sd.name,
              }))}
              placeholder="Select seasonal designation"
            />
          </div>
        )}

        {/* Description Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium h-auto">Product Descriptions</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDescriptions(!showDescriptions)}
            >
              {showDescriptions ? "Hide Descriptions" : "Show Descriptions"}
            </Button>
          </div>

          {showDescriptions && (
            <div className=" flex flex-col gap-4">
              {languages.length === 0 ? (
                <p>Loading languages for description...</p>
              ) : (
                languages.map((lang) => {

                  return (
                    <CustomInput
                      key={lang.code}
                      form={form}
                      name={`description.${lang.code}`} // valid for object
                      title={`Description (${lang.name})`}
                      variant="textarea"
                      rows={3}
                      placeholder={`Write ${lang.name} description`}
                    />
                  )
                }))}
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomInput
              form={form}
              name="availability"
              title="Available"
              variant="switch"
            />

            <CustomInput
              form={form}
              name="value_buys"
              title="Value Buy"
              variant="switch"
            />

            <CustomInput
              form={form}
              name="status"
              title="Active Status"
              variant="switch"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          {/* <Button
            type="button"
            onClick={() => console.log("Debug form values:", form.getValues())}
          >
            Debug Form
          </Button> */}
          <Button
            type="submit"
            disabled={btnLoading}
            className="px-8 py-2 cursor-pointer"
          >
            {(!defaultValues?.productId) ? (btnLoading ? 'Creating Product...' : 'Create Product') : (btnLoading ? 'Updating Product...' : 'Update Product')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
