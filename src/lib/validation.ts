import { z } from 'zod';

// Part validation schema
export const PartSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, 'نام قطعه الزامی است').max(200, 'نام قطعه حداکثر 200 کاراکتر'),
  sku: z.string().trim().min(1, 'SKU الزامی است').max(50, 'SKU حداکثر 50 کاراکتر'),
  category: z.string().trim().min(1, 'دسته‌بندی الزامی است').max(100),
  footprint: z.string().trim().max(100),
  location: z.string().trim().min(1, 'مکان الزامی است').max(200),
  quantity: z.number().int().min(0, 'موجودی نمی‌تواند منفی باشد').max(1000000000),
  mpn: z.string().trim().max(100),
  datasheet_url: z.string().trim().max(500)
    .refine((url) => {
      if (!url) return true; // Empty is OK
      try {
        const parsed = new URL(url);
        // Only allow http/https protocols
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'لینک دیتاشیت معتبر نیست'),
});

export type Part = z.infer<typeof PartSchema>;

// Shopping item validation schema
export const ShoppingItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, 'عنوان الزامی است').max(200, 'عنوان حداکثر 200 کاراکتر'),
  quantity: z.number().int().min(1, 'تعداد باید حداقل 1 باشد').max(1000000),
  price: z.number().min(0, 'قیمت نمی‌تواند منفی باشد').max(1000000000000),
  group_name: z.string().trim().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'رنگ معتبر نیست'),
  short_info: z.string().trim().max(500).optional(),
  full_info: z.string().trim().max(5000).optional(),
  suppliers: z.array(z.object({
    name: z.string().trim().min(1).max(200),
    price: z.number().min(0).max(1000000000000),
  })),
  width: z.string().optional(),
  height: z.string().optional(),
  sort_order: z.number().int().min(0),
});

export type ShoppingItem = z.infer<typeof ShoppingItemSchema>;

// Transaction validation schema
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  part_sku: z.string().trim().min(1).max(50),
  type: z.enum(['ورود', 'خروج']),
  quantity: z.number().int().min(1).max(1000000),
  date: z.string().trim(),
  created_at: z.string().trim(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Safe localStorage operations with validation
export function safeLoadFromStorage<T>(
  key: string,
  schema: z.ZodSchema<T>
): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.warn(`Invalid data in localStorage key "${key}": not an array`);
      return [];
    }
    
    // Validate each item
    const validated = parsed.map((item, index) => {
      const result = schema.safeParse(item);
      if (!result.success) {
        console.warn(`Invalid item at index ${index} in "${key}":`, result.error);
        return null;
      }
      return result.data;
    }).filter((item): item is T => item !== null);
    
    return validated;
  } catch (error) {
    console.warn(`Error loading from localStorage key "${key}":`, error);
    return [];
  }
}

export function safeSaveToStorage<T>(
  key: string,
  data: T[],
  schema: z.ZodSchema<T>
): boolean {
  try {
    // Validate all items before saving
    const validated = data.map((item) => {
      const result = schema.safeParse(item);
      if (!result.success) {
        throw new Error(`Validation failed: ${result.error.message}`);
      }
      return result.data;
    });
    
    localStorage.setItem(key, JSON.stringify(validated));
    return true;
  } catch (error) {
    console.warn(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
}
