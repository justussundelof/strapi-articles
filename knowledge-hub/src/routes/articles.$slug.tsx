import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import type { Article, ArticleAttributes, StrapiResponse } from '../types/strapi'

const STRAPI_BASE_URL = 'http://localhost:1337/api'

// Loader function to fetch article by slug
async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(
      `${STRAPI_BASE_URL}/articles?filters[slug][$eq]=${slug}&populate=category`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`)
    }

    const data: StrapiResponse<ArticleAttributes> = await response.json()

    if (!data.data || data.data.length === 0) {
      return null
    }

    return data.data[0]
  } catch (error) {
    console.error('Error fetching article:', error)
    throw error
  }
}

export const Route = createFileRoute('/articles/$slug')({
  loader: async ({ params }) => {
    const article = await getArticleBySlug(params.slug)

    if (!article) {
      throw notFound()
    }

    return { article }
  },
  component: ArticlePage,
  errorComponent: ErrorComponent,
  pendingComponent: LoadingComponent,
  notFoundComponent: NotFoundComponent,
})

function ArticlePage() {
  const { article } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          to="/articles"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to articles
        </Link>

        {/* Article Container */}
        <article className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 md:p-12">
          {/* Category Badge */}
          {article.attributes.category?.data && (
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 text-sm font-semibold text-cyan-400 bg-cyan-400/10 rounded-full">
                {article.attributes.category.data.attributes.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {article.attributes.title}
          </h1>

          {/* Published Date */}
          <p className="text-gray-400 mb-8 pb-8 border-b border-slate-700">
            Published on{' '}
            {new Date(article.attributes.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {/* Article Content with Prose Styling */}
          <div className="prose prose-invert prose-lg prose-cyan max-w-none">
            <BlocksRenderer content={article.attributes.content} />
          </div>
        </article>

        {/* Back Link Bottom */}
        <div className="mt-8">
          <Link
            to="/articles"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to articles
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoadingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        <p className="text-gray-400 mt-4">Loading article...</p>
      </div>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to articles
          </Link>
        </div>
      </div>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Article
          </h2>
          <p className="text-gray-300 mb-4">{error.message}</p>
          <p className="text-gray-400 text-sm mb-6">
            Please make sure Strapi is running on http://localhost:1337
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to articles
          </Link>
        </div>
      </div>
    </div>
  )
}
