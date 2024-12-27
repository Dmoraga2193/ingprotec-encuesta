"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface SurveyData {
  questions: string[];
  timestamp: string;
  deviceId: string;
  isTestSubmission: boolean;
  suggestions?: string;
}

const questions = [
  "¿Qué tan clara y efectiva consideras la dirección y liderazgo de la empresa?",
  "¿Qué tan efectiva es la comunicación dentro de los equipos y entre los diferentes departamentos?",
  "¿Qué tan satisfecho estás con el ambiente de trabajo y la colaboración entre compañeros?",
  "¿Qué tan adecuados y accesibles son los recursos y herramientas para realizar tu trabajo?",
  "¿Qué tan satisfecho estás con las oportunidades de aprendizaje y crecimiento profesional que ofrece la empresa?",
  "¿Qué tan valorado te sientes por tu trabajo y logros dentro de la empresa?",
  "Según tu percepción, ¿qué tan bien se prioriza y gestiona la satisfacción del cliente en la empresa?",
  "¿Qué tan claros, eficientes y funcionales consideras los procesos internos de la empresa?",
  "¿Qué tan bien fomenta la empresa la innovación y la adaptación a los cambios del mercado?",
  "¿Qué tan satisfecho estás, en general, con la empresa como lugar de trabajo?",
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

export function StatisticsDashboard() {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const q = query(
          collection(db, "surveys"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data() as SurveyData);
        setSurveyData(data);
      } catch (err) {
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
        console.error("Error fetching surveys:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center text-muted-foreground">
            Cargando estadísticas...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const realData = surveyData.filter((survey) => !survey.isTestSubmission);

  return (
    <div className="space-y-8">
      <StatsContent data={realData} />
    </div>
  );
}

function StatsContent({ data }: { data: SurveyData[] }) {
  const uniqueResponses = new Set(data.map((survey) => survey.deviceId)).size;

  const getQuestionStats = (questionIndex: number) => {
    const scores = data.map((survey) =>
      parseInt(survey.questions[questionIndex])
    );
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const sortedScores = [...scores].sort((a, b) => a - b);
    const median = sortedScores[Math.floor(sortedScores.length / 2)];
    const mode = scores.reduce(
      (a, b, i, arr) =>
        arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
          ? a
          : b,
      scores[0]
    );
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) /
      scores.length;
    const stdDev = Math.sqrt(variance);

    const distribution = Array(10).fill(0);
    scores.forEach((score) => distribution[score - 1]++);

    return {
      average: average.toFixed(2),
      median,
      mode,
      stdDev: stdDev.toFixed(2),
      distribution,
    };
  };

  const overallAverage =
    data.reduce(
      (sum, survey) =>
        sum +
        survey.questions.reduce((qSum, q) => qSum + parseInt(q), 0) /
          survey.questions.length,
      0
    ) / data.length;

  const chartData = questions.map((q, index) => ({
    pregunta: `P${index + 1}`,
    promedio: parseFloat(getQuestionStats(index).average),
  }));

  const radarData = questions.map((q, index) => ({
    pregunta: `P${index + 1}`,
    promedio: parseFloat(getQuestionStats(index).average),
  }));

  const pieData = questions.map((q, index) => ({
    name: `P${index + 1}`,
    value: parseFloat(getQuestionStats(index).average),
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Respuestas
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio General
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallAverage.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promedio por Pregunta</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="pregunta" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="promedio" name="Promedio">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Promedios</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radar de Promedios por Pregunta</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="pregunta" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar
                    name="Promedio"
                    dataKey="promedio"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado por Pregunta</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {questions.map((question, index) => {
              const stats = getQuestionStats(index);
              return (
                <AccordionItem value={`question-${index}`} key={index}>
                  <AccordionTrigger>
                    Pregunta {index + 1}: {question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Métrica</TableHead>
                            <TableHead>Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Promedio</TableCell>
                            <TableCell>{stats.average}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mediana</TableCell>
                            <TableCell>{stats.median}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Moda</TableCell>
                            <TableCell>{stats.mode}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Desviación Estándar</TableCell>
                            <TableCell>{stats.stdDev}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Distribución de Respuestas
                        </h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={stats.distribution.map((count, i) => ({
                              valor: i + 1,
                              cantidad: count,
                            }))}
                          >
                            <XAxis dataKey="valor" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="cantidad"
                              fill={COLORS[index % COLORS.length]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sugerencias y Comentarios</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {data
              .filter(
                (survey) =>
                  survey.suggestions && survey.suggestions.trim() !== ""
              )
              .map((survey, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(survey.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm">{survey.suggestions}</p>
                </div>
              ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
