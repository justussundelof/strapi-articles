import { createFileRoute, Link } from '@tanstack/react-router'
import type { Article, ArticleAttributes, StrapiResponse } from '../types/strapi'

const STRAPI_BASE_URL = 'http://localhost:1337/api'

// Loader function to fetch articles
async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(
      `${STRAPI_BASE_URL}/articles?populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`)
    }

    const data: StrapiResponse<ArticleAttributes> = await response.json()

    // Debug log to see the actual response structure
    console.log('Strapi API response:', JSON.stringify(data, null, 2))
    console.log('Number of articles received:', data.data.length)

    // Log each article's slug and title to see what we have
    data.data.forEach((article, index) => {
      console.log(`Article ${index}:`, {
        id: article.id,
        slug: article.attributes?.slug,
        title: article.attributes?.title,
        hasSlug: !!article.attributes?.slug,
        hasTitle: !!article.attributes?.title,
      })
    })

    // Filter out any invalid articles and ensure they have required fields
    const validArticles = data.data.filter(
      (article) => article?.attributes?.slug && article?.attributes?.title
    )

    console.log('Number of valid articles after filtering:', validArticles.length)

    return validArticles
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}

export const Route = createFileRoute('/articles')({
  loader: async () => {
    const articles = await getArticles()
    return { articles }
  },
  component: ArticlesPage,
  errorComponent: ErrorComponent,
  pendingComponent: LoadingComponent,
})

function ArticlesPage() {
  const { articles } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Knowledge Hub
          </h1>
          <p className="text-xl text-gray-400">
            Explore our collection of articles
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 max-w-md mx-auto">
              <p className="text-gray-400 text-lg">
                No articles found. Start by creating your first article in
                Strapi!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles
              .filter((article) => article?.attributes?.slug && article?.attributes?.title) // Filter out invalid articles
              .map((article) => (
                <Link
                  key={article.id}
                  to="/articles/$slug"
                  params={{ slug: article.attributes.slug }}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105"
                >
                  {/* Category Badge */}
                  {article.attributes.category?.data && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-400/10 rounded-full">
                        {article.attributes.category.data.attributes.name}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {article.attributes.title}
                  </h2>

                  {/* Published Date */}
                  <p className="text-gray-400 text-sm">
                    {new Date(
                      article.attributes.publishedAt
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>

                {/* Read More Link */}
                <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                  Read article
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        <p className="text-gray-400 mt-4">Loading articles...</p>
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
            Error Loading Articles
          </h2>
          <p className="text-gray-300 mb-4">{error.message}</p>
          <p className="text-gray-400 text-sm">
            Please make sure Strapi is running on http://localhost:1337
          </p>
        </div>
      </div>
    </div>
  )
}
