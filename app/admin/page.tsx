import { StatisticsDashboard } from "@/components/admin/statistics-dashboard";
import { TestDataGenerator } from "@/components/admin/test-data-generator";
import { SurveyQR } from "@/components/survey-qr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="grid gap-8">
          <div className="grid gap-8 md:grid-cols-2">
            <SurveyQR />
            <TestDataGenerator />
          </div>
          <StatisticsDashboard />
        </div>
      </div>
    </div>
  );
}
