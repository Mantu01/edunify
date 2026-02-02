import { Sidebar } from "@/components/profile/sidebar";
import Content from "@/components/profile/main-content";

export default function Profile() {

  return (
      <div className="container mx-auto px-4 pt-5">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar/>
          <div className="flex-1">
            <Content/>
          </div>
        </div>
      </div>
  )
}