import { UserProfile } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";

function UserCard() {
  return (
    <Card className="border-2 h-160 border-amber-200/40 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
      <UserProfile
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: "hsl(38, 92%, 50%)",
            colorText: "hsl(20, 14%, 4%)",
            colorBackground: "hsla(38, 100%, 91%, 0.2)",
            colorInputBackground: "hsla(38, 100%, 94%, 0.3)",
            colorInputText: "hsl(20, 14%, 4%)",
          },
          elements: {
            rootBox: "w-full",
            card: "w-full bg-transparent shadow-none border-none font-['Inter']",
            headerTitle: "text-gray-900 text-2xl font-bold tracking-tight",
            headerSubtitle: "text-amber-800/70",
            socialButtonsBlockButton: "border-2 border-amber-300/50 bg-amber-50/30 hover:bg-amber-100/50 rounded-xl",
            socialButtonsBlockButtonText: "text-gray-900 font-medium",
            formButtonPrimary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl",
            formButtonSecondary: "border-amber-300 text-amber-800 hover:bg-amber-50 font-semibold rounded-xl",
            formFieldLabel: "text-gray-900 font-semibold text-sm",
            formFieldInput: "border-2 border-amber-300/50 bg-amber-50/30 text-gray-900 rounded-xl focus:ring-2 focus:ring-amber-500/30",
            footerActionLink: "text-amber-700 hover:text-amber-800 font-semibold",
            identityPreviewEditButton: "text-amber-700 hover:text-amber-800 font-medium",
            navbarButton: "text-gray-900 hover:bg-amber-100/50 font-semibold rounded-lg",
            navbar: "border-b-2 border-amber-200/40",
          },
        }}
        />
    </Card>
  )
}

export default UserCard;