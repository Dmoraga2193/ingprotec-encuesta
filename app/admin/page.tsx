import { StatisticsDashboard } from "@/components/admin/statistics-dashboard";
import { SurveyQR } from "@/components/survey-qr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, QrCode } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Panel de Administración
          </h1>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Código QR
                  </h2>
                  <QrCode className="h-6 w-6 text-teal-500" />
                </div>
                <SurveyQR />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Estadísticas de la Encuesta
                  </h2>
                  <BarChart2 className="h-6 w-6 text-teal-500" />
                </div>
                <StatisticsDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
