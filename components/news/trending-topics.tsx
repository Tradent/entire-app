import Link from "next/link"
import { TrendingUp } from "lucide-react"

export default function TrendingTopics() {
  const trendingTopics = [
    { name: "Digital Fashion Week", count: 28 },
    { name: "Metaverse Real Estate", count: 24 },
    { name: "Wearable NFTs", count: 22 },
    { name: "Virtual Runways", count: 19 },
    { name: "AR Fashion", count: 17 },
    { name: "Sustainable Digital Fashion", count: 15 },
    { name: "Fashion DAOs", count: 13 },
    { name: "Digital Accessories", count: 11 },
  ]

  return (
    <section className="p-5 border rounded-lg bg-card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Trending Topics</h3>
      </div>

      <ul className="space-y-2">
        {trendingTopics.map((topic) => (
          <li key={topic.name}>
            <Link
              href={`/news/topics/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center justify-between group"
            >
              <span className="text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400">
                #{topic.name}
              </span>
              <span className="text-xs text-muted-foreground">{topic.count} articles</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
