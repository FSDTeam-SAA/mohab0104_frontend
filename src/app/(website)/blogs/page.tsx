"use client"
import { useQuery } from "@tanstack/react-query";
import { BlogCard } from "./_components/BlogCard";
import useAxios from "@/hooks/useAxios";

interface BlogCardProps {
  _id: string;
  blogTitle: string;
  size?: "small" | "medium" | "large";
  createdAt?: string
}

export default function BlogPage() {

  const axiosInstance = useAxios();

  const {data : blogs, isLoading} = useQuery({
    queryKey : ["all-blogs"],
    queryFn : async () => {
      const res = await axiosInstance('/blog/get');
      return res.data?.data;
    }
  })

  if(isLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center font-medium text-xl">Loading Blogs....</div>
  )

  return (
    <div className="container mx-auto py-24">
      {/* Latest Blogs Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-gray-900">Latest Blogs</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
            Our team is always here to keep you up-to-date with the latest
            trends in the digital world. Find all the tips and tricks right here
            to grow your business online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <BlogCard
              imageSrc="/blog.png"
              title=""
              size="large"
            />
          </div>
          <div className="space-y-6">
            <BlogCard
              imageSrc="/blog.png"
              title=""
              size="medium"
            />
            <BlogCard
              imageSrc="/blog.png"
              title=""
              size="medium"
            />
          </div>
        </div>
      </section>

      {/* All Blogs Post Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-gray-900">
            All Blogs Post
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
            Our team is always here to keep you up-to-date with the latest
            trends in the digital world. Find all the tips and tricks right here
            to grow your business online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {blogs.map((blog : BlogCardProps) => (
            <div key={blog?._id}>
              <BlogCard
                imageSrc={`/blog.png`}
                title={blog?.blogTitle}
                size="small"
                createdAt={blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                id={blog?._id}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
