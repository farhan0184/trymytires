'use client'
import About from "@/components/site/home/about";
import Discount from "@/components/site/home/discount";
import Hero from "@/components/site/home/hero";
import WhyTryMyTires from "@/components/site/home/whytrymytires";
import { useFetch } from "../helper/hooks";
import { fetchPageData } from "../helper/backend";
import HomepageSkeleton from "@/components/loading/homeSkeleton";

export default function Home() {
  const [data, getData, {loading}] = useFetch(fetchPageData, {slug:"home_page"})


  if(loading || !data){
    return <HomepageSkeleton/>
  }
  
  return (
    <div className="md:p-3">
      {
        <Hero
          image={data?.content?.promotional_image}
          slider_images={data?.content?.slider_images}
        />
      }
      <Discount />
      <About about={data?.content?.about} />
      <WhyTryMyTires faq={data?.content?.faq} />
    </div>
  );
}
