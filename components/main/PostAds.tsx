"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(1, "City is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  condition: z.string().optional(),
  price: z
    .string()
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Enter a valid price")
    .optional(),
  isNegotiable: z.boolean().optional(),
  promotion: z.string().min(1, "Choose a promotion type"),
});

type FormData = z.infer<typeof formSchema>;

const promotionOptions = [
  {
    value: "free",
    title: "Free",
    description: "Standard listing. Appears in regular results.",
    price: "₵0.00",
  },
  {
    value: "featured",
    title: "Featured",
    description: "Highlighted ad placed above free listings.",
    price: "₵15.00",
  },
  {
    value: "urgent",
    title: "Urgent",
    description: "Adds an 'Urgent' badge to your ad.",
    price: "₵10.00",
  },
  {
    value: "top",
    title: "Top Ad",
    description: "Pinned to top for 7 days in your category.",
    price: "₵25.00",
  },
];

export default function PostAdForm() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [ghanaData, setGhanaData] = useState<any>({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      subcategory: "",
      region: "",
      city: "",
      title: "",
      description: "",
      condition: "",
      price: "",
      isNegotiable: false,
      promotion: "",
    },
  });

  // Load categories and Ghana regions/cities
  useEffect(() => {
    fetch("/data/categories.json")
      .then((res) => res.json())
      .then((data) => setCategories(data));
    fetch("/data/ghana.json")
      .then((res) => res.json())
      .then((data) => {
        setGhanaData(data);
        setRegions(Object.keys(data));
      });
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    const cat = categories.find((c) => c.id === form.watch("category"));
    setSubcategories(cat ? cat.subcategories : []);
    form.setValue("subcategory", "");
  }, [form.watch("category"), categories]);

  // Update cities when region changes
  useEffect(() => {
    setCities(ghanaData[form.watch("region")] || []);
    form.setValue("city", "");
  }, [form.watch("region"), ghanaData]);

  const onSubmit = (values: FormData) => {
    const formData = {
      ...values,
      images,
      promotion: selectedPromo,
    };

    toast.success("Ad Submitted!");
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-black p-4 text-white text-sm">
        {JSON.stringify(formData, null, 2)}
      </pre>,
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handlePromotionSelect = (title: string) => {
    setSelectedPromo(title);
    form.setValue("promotion", title);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {step === 1 && (
          <>
            {/* CATEGORY */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBCATEGORY */}
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* REGION */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CITY */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Town</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city/town" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. iPhone 13 Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONDITION */}
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* PRICE */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="GH₵ 0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IMAGES */}
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            </FormItem>

            {/* IS NEGOTIABLE */}
            <FormField
              control={form.control}
              name="isNegotiable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Negotiable?</FormLabel>
                  <Input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </FormItem>
              )}
            />
          </>
        )}

        {step === 2 && (
          <>
            <FormField
              control={form.control}
              name="promotion"
              render={() => (
                <FormItem>
                  <FormLabel>Choose a Promotion Type</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {promotionOptions.map((promo) => (
                      <div
                        key={promo.title}
                        onClick={() => handlePromotionSelect(promo.title)}
                        className={clsx(
                          "border rounded-lg p-4 cursor-pointer hover:border-blue-500",
                          selectedPromo === promo.title && "border-blue-600 ",
                        )}
                      >
                        <h4 className="font-semibold">{promo.title}</h4>
                        <p className="text-sm text-gray-600">
                          {promo.description}
                        </p>
                        <p className="text-primary font-bold mt-1">
                          {promo.price}
                        </p>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Summary */}
            <div className="mt-6 border rounded-md p-4 text-sm">
              <h3 className="font-semibold mb-2">Ad Preview:</h3>
              <p>
                <strong>Title:</strong> {form.watch("title")}
              </p>
              <p>
                <strong>Price:</strong> GH₵ {form.watch("price")}
              </p>
              <p>
                <strong>Category:</strong> {form.watch("category")}
              </p>
              <p>
                <strong>Promotion:</strong> {selectedPromo}
              </p>
            </div>
          </>
        )}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <Button type="button" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 2 && (
            <Button type="button" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button type="submit" className="ml-auto">
              Submit Ad
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
