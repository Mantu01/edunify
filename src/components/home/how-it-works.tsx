import { HOW_IT_WORKS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Simple steps to transform how you learn, teach, or hire
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((item) => (
            <Card key={item.step} className="border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <span className="text-xl font-bold">{item.step}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{item.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}