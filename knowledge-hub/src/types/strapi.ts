// Strapi Rich Text Block Types
export interface RichTextContent {
  type: string
  children?: RichTextContent[]
  [key: string]: any
}

// Category Type (Strapi v5 flat format)
export interface Category {
  id: number
  documentId: string
  Name: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Article Type (Strapi v5 flat format)
export interface Article {
  id: number
  documentId: string
  title: string
  slug: string | null
  content: RichTextContent[]
  category: Category
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Strapi API Response Types (v5 format)
export interface StrapiResponse {
  data: Article[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiSingleResponse {
  data: Article | null
  meta?: any
}

// Legacy types for backward compatibility (deprecated)
export interface CategoryAttributes {
  name: string
  slug: string
}

export interface ArticleAttributes {
  title: string
  slug: string
  content: RichTextContent[]
  category: {
    data: Category
  }
  publishedAt: string
}
