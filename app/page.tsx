import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList, BarChart2, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Sistema de Encuestas
          </h1>
          <p className="mt-4 text-xl text-center max-w-2xl mx-auto">
            Una plataforma moderna para recopilar y analizar feedback de manera
            eficiente
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Bienvenido a nuestro Sistema de Encuestas
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Diseñado para ayudarte a obtener insights valiosos de tus empleados
            y mejorar tu organización.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
            <Link href="/survey">Ir a la Encuesta</Link>
          </Button>
          {/* <Button
            asChild
            size="lg"
            variant="outline"
            className="text-teal-600 border-teal-600 hover:bg-teal-50"
          >
            <Link href="/admin">Panel de Administración</Link>
          </Button> */}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-600 dark:text-teal-400">
                <ClipboardList className="mr-2" />
                Encuestas Personalizables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Crea encuestas adaptadas a las necesidades específicas de tu
                organización para obtener feedback preciso y relevante.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-600 dark:text-teal-400">
                <BarChart2 className="mr-2" />
                Análisis Detallado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Obtén insights profundos con nuestras herramientas de análisis
                avanzadas, visualizaciones claras y reportes detallados.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-600 dark:text-teal-400">
                <Users className="mr-2" />
                Experiencia de Usuario Intuitiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Interfaz fácil de usar tanto para administradores como para
                participantes, asegurando una alta tasa de respuesta.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>
            &copy; 2024 Sistema de Encuestas. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
