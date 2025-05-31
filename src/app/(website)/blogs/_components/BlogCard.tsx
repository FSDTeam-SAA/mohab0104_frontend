import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  imageSrc: string;
  title: string;
  size?: "small" | "medium" | "large";
  createdAt?: string;
  id?: string
}

export function BlogCard({ imageSrc, title, size = "small", createdAt, id}: BlogCardProps) {
  const imageHeight = size === "large" ? 400 : size === "medium" ? 200 : 180;
  const imageWidth = size === "large" ? 600 : size === "medium" ? 400 : 300;

  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-md">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          width={imageWidth}
          height={imageHeight}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {size === "small" && (
        <div>
          <h1 className="mt-3 text-[#8a8ac5]">
            {createdAt}
          </h1>
        </div>
      )}

      {size === "small" && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <Link href={`blogs/blog-details/${id}`}>
            <button className="mt-3 inline-block text-xs text-[#38b1ea] border border-[#38b1ea] py-2 px-5 rounded-lg">
              View Details
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
