import { type Category } from "@/types";
import { Card, CardContent } from "@/components/ui";

interface CategoryCardProps {
  category: Category;
  onClick?: (categoryId: string) => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group"
      onClick={() => onClick?.(category.id)}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center h-48 group-hover:bg-primary-50">
        <div className="mb-4 group-hover:scale-110 transition-transform duration-200">
          <img
            src={category.icon}
            alt={category.name}
            className="w-12 h-12 object-cover mx-auto"
          />
        </div>
        <h3 className="text-sm font-bold text-center text-neutral-900 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-neutral-600 mt-2">
          {category.courseCount.toLocaleString()} courses
        </p>
      </CardContent>
    </Card>
  );
}
