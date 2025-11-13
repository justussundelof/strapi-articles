// Strapi Rich Text Block Types
export interface RichTextContent {
  type: string
  children?: RichTextContent[]
  [key: string]: any
}

// Category Type (Strapi attributes only)
export interface CategoryAttributes {
  name: string
  slug: string
}

export interface Category {
  id: number
  attributes: CategoryAttributes
}

// Article Type (Strapi attributes only)
export interface ArticleAttributes {
  title: string
  slug: string
  content: RichTextContent[]
  category: {
    data: Category
  }
  publishedAt: string
}

export interface Article {
  id: number
  attributes: ArticleAttributes
}

// Strapi API Response Types
export interface StrapiResponse<T> {
  data: Array<{
    id: number
    attributes: T
  }>
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiSingleResponse<T> {
  data: {
    id: number
    attributes: T
  } | null
}
