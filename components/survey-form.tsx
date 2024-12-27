"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getDeviceId, generateSurveyId, isTestMode } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const formSchema = z.object({
  questions: z.array(z.string()).min(10, {
    message: "Por favor responda todas las preguntas.",
  }),
  suggestions: z.string().optional(),
});

const questions = [
  {
    title: "Liderazgo y Dirección",
    question:
      "¿Qué tan clara y efectiva consideras la dirección y liderazgo de la empresa?",
    description:
      "Evalúa la claridad de la visión y la efectividad de la toma de decisiones a nivel directivo.",
  },
  {
    title: "Comunicación Interna",
    question:
      "¿Qué tan efectiva es la comunicación dentro de los equipos y entre los diferentes departamentos?",
    description:
      "Valora la fluidez y claridad de la información compartida en la organización.",
  },
  {
    title: "Ambiente Laboral",
    question:
      "¿Qué tan satisfecho estás con el ambiente de trabajo y la colaboración entre compañeros?",
    description:
      "Evalúa el clima laboral, las relaciones interpersonales y el trabajo en equipo.",
  },
  {
    title: "Recursos y Herramientas",
    question:
      "¿Qué tan adecuados y accesibles son los recursos y herramientas para realizar tu trabajo?",
    description:
      "Valora si cuentas con lo necesario para desempeñar tus funciones eficientemente.",
  },
  {
    title: "Capacitación y Desarrollo",
    question:
      "¿Qué tan satisfecho estás con las oportunidades de aprendizaje y crecimiento profesional que ofrece la empresa?",
    description:
      "Evalúa los programas de formación y las posibilidades de desarrollo de carrera.",
  },
  {
    title: "Reconocimiento",
    question:
      "¿Qué tan valorado te sientes por tu trabajo y logros dentro de la empresa?",
    description:
      "Valora si tus contribuciones son reconocidas y apreciadas adecuadamente.",
  },
  {
    title: "Satisfacción del Cliente",
    question:
      "Según tu percepción, ¿qué tan bien se prioriza y gestiona la satisfacción del cliente en la empresa?",
    description:
      "Evalúa el enfoque de la empresa en la experiencia y satisfacción del cliente.",
  },
  {
    title: "Procesos Internos",
    question:
      "¿Qué tan claros, eficientes y funcionales consideras los procesos internos de la empresa?",
    description:
      "Valora la organización y efectividad de los procedimientos y flujos de trabajo.",
  },
  {
    title: "Innovación y Adaptabilidad",
    question:
      "¿Qué tan bien fomenta la empresa la innovación y la adaptación a los cambios del mercado?",
    description:
      "Evalúa la cultura de innovación y la flexibilidad organizacional frente a nuevos desafíos.",
  },
  {
    title: "Satisfacción General",
    question:
      "¿Qué tan satisfecho estás, en general, con la empresa como lugar de trabajo?",
    description:
      "Valora tu nivel general de satisfacción considerando todos los aspectos de tu experiencia laboral.",
  },
];

export function SurveyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [testMode, setTestMode] = useState(isTestMode());
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkPreviousSubmission = async () => {
      const id = await getDeviceId();
      setDeviceId(id);

      if (!testMode) {
        const docRef = doc(db, "devices", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHasSubmitted(true);
          setShowAlert(true);
        }
      }
    };

    checkPreviousSubmission();
  }, [testMode]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [],
      suggestions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const surveyId = generateSurveyId();

      await setDoc(doc(db, "surveys", surveyId), {
        ...values,
        timestamp: new Date().toISOString(),
        deviceId: deviceId,
        isTestSubmission: testMode,
      });

      if (!testMode) {
        await setDoc(doc(db, "devices", deviceId), {
          lastSubmission: new Date().toISOString(),
          surveyId: surveyId,
        });
      }

      toast({
        title: testMode ? "Prueba enviada" : "Encuesta enviada",
        description: testMode
          ? "Gracias por probar la encuesta."
          : "Gracias por completar la encuesta.",
      });

      if (!testMode) {
        setHasSubmitted(true);
      }
      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Error",
        description: `Hubo un error al enviar la encuesta: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            ¡Gracias por tu participación!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tu opinión es muy valiosa para nosotros. Hemos registrado tus
            respuestas con éxito.
          </p>
          {testMode && (
            <Button
              onClick={() => {
                setIsCompleted(false);
                form.reset();
                setCurrentStep(0);
              }}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Realizar otra prueba
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (hasSubmitted && !testMode) {
    return (
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ya has completado esta encuesta</AlertDialogTitle>
            <AlertDialogDescription>
              Solo se permite una respuesta por dispositivo. Gracias por tu
              participación.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const canGoNext =
    currentStep < questions.length
      ? form.watch(`questions.${currentStep}`)
      : form.watch("suggestions") !== undefined;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-xl">
      <CardHeader className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Encuesta de Satisfacción Laboral
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="test-mode"
              checked={testMode}
              onCheckedChange={setTestMode}
            />
            <label
              htmlFor="test-mode"
              className="text-sm text-muted-foreground"
            >
              Modo de prueba
            </label>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep + 1) / (questions.length + 1)) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep < questions.length ? (
                  <FormField
                    control={form.control}
                    name={`questions.${currentStep}`}
                    render={({ field }) => (
                      <FormItem className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                            {questions[currentStep].title}
                          </FormLabel>
                          <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                            {questions[currentStep].question}
                          </CardDescription>
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {questions[currentStep].description}
                          </p>
                        </div>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-4"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                              <FormItem key={value}>
                                <FormControl>
                                  <RadioGroupItem
                                    value={value.toString()}
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <FormLabel className="flex flex-col items-center justify-center h-12 sm:h-16 rounded-lg border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-purple-500 dark:hover:border-pink-500 peer-data-[state=checked]:border-purple-500 dark:peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-pink-900/20 [&:has([data-state=checked])]:border-purple-500 dark:[&:has([data-state=checked])]:border-pink-500 cursor-pointer transition-all duration-200 ease-in-out">
                                  <span className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200">
                                    {value}
                                  </span>
                                  {(value === 1 || value === 10) && (
                                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
                                      {value === 1 ? "Muy bajo" : "Excelente"}
                                    </span>
                                  )}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="suggestions"
                    render={({ field }) => (
                      <FormItem className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                            Sugerencias y Comentarios
                          </FormLabel>
                          <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                            ¿Tienes alguna sugerencia o comentario adicional
                            para mejorar tu experiencia en la empresa?
                          </CardDescription>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe tus sugerencias aquí..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((step) => step - 1)}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>

              {currentStep === questions.length + 1 ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px] bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando
                    </>
                  ) : (
                    "Finalizar"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setCurrentStep((step) => step + 1)}
                  disabled={!canGoNext}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
