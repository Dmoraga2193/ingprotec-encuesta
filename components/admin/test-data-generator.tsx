"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Database } from "lucide-react";
import { generateRandomSurveyResponse, generateSurveyId } from "@/lib/utils";

export function TestDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTestData = async () => {
    setIsGenerating(true);
    try {
      const promises = Array(10)
        .fill(0)
        .map(async () => {
          const surveyId = generateSurveyId();
          const testData = generateRandomSurveyResponse();
          await setDoc(doc(db, "surveys", surveyId), testData);
        });

      await Promise.all(promises);

      toast({
        title: "Datos de prueba generados",
        description: "Se han generado 10 respuestas aleatorias exitosamente.",
      });
    } catch (error) {
      console.error("Error generating test data:", error);
      toast({
        title: "Error",
        description: "Hubo un error al generar los datos de prueba.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Generador de Datos de Prueba</CardTitle>
        <CardDescription>
          Genera 10 respuestas aleatorias para probar el panel de estadísticas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={generateTestData}
          disabled={isGenerating}
          className="w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando datos...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Generar 10 Respuestas Aleatorias
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
