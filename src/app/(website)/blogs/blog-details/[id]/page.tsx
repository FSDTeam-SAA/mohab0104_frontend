"use client"
import useAxios from "@/hooks/useAxios"
import { useQuery } from "@tanstack/react-query"

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {

  const axiosInstance = useAxios();

  const {data : singleBlog} = useQuery({
    queryKey : ["single-blog"],
    queryFn : async () => {
      const res = await axiosInstance(`/blog/${params.id}`);
      return res.data?.data
    }
  })

  return (
    <div className="py-24 container mx-auto">{singleBlog?.blogTitle}</div>
  )
}

export default Page