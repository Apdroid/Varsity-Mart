# API Data Structure

This directory contains mock data organized to match the API endpoints structure from `Backend 1.md`.

## Structure

```
data/api/
├── restaurants/
│   ├── list.ts          # GET /restaurants (PaginatedResponse)
│   ├── detail.ts        # GET /restaurants/:id (ApiResponse)
│   └── menu.ts          # GET /restaurants/:id/menu (ApiResponse)
├── stores/
│   ├── list.ts          # GET /stores (PaginatedResponse)
│   ├── detail.ts        # GET /stores/:id (ApiResponse)
│   └── products.ts      # GET /stores/:id/products (PaginatedResponse)
├── products/
│   ├── list.ts          # GET /products (PaginatedResponse)
│   └── detail.ts        # GET /products/:id (ApiResponse)
└── mock/
    ├── restaurants.ts   # Raw mock restaurant data
    ├── restaurant-menu.ts # Raw mock menu data
    ├── stores.ts        # Raw mock store data
    └── products.ts      # Raw mock product data
```

## Usage

### In Routes (Server Components)

```typescript
// app/restaurants/[id]/page.tsx
import { restaurantsService } from "@/lib/api/services/restaurants.service"
import { getMockRestaurantDetailResponse } from "@/data/api/restaurants/detail"

// Try API first, fallback to mock
try {
  const response = await restaurantsService.getRestaurantById(id);
  restaurant = response.data;
} catch (error) {
  const mockResponse = getMockRestaurantDetailResponse(id);
  restaurant = mockResponse.data;
}
```

### Response Formats

All responses match the API structure from `Backend 1.md`:

- **PaginatedResponse**: `{ success: true, data: T[], meta: { page, limit, total, totalPages } }`
- **ApiResponse**: `{ success: true, data: T, message?: string }`

## Migration Notes

- Old data files in `data/food/`, `data/stores/`, `data/products/` are still available for backward compatibility
- New API structure uses these files via re-exports in `data/api/mock/`
- Components now accept `initialData` props from server-side API calls
- Routes handle API calls with graceful fallback to mock data

