import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container flex justify-between items-center gap-4">
      <Card className="w-full h-full hover:border-primary">
        <CardHeader className="cursor-default">
          <CardTitle className="text-primary font-bold">
            Calculadora Intervalo de Confiança
          </CardTitle>
          <CardDescription>
            Utilize para calcular intervalos de confiança!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={"outline"}>Abrir calculadora</Button>
        </CardContent>
      </Card>

      <Card className="w-full h-full hover:border-primary">
        <CardHeader className="cursor-default">
          <CardTitle className="text-primary font-bold">
            Calculadora Tamanho da Amostra
          </CardTitle>
          <CardDescription>
            Utilize para calcular o tamanho de amostras!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={"outline"}>Abrir calculadora</Button>
        </CardContent>
      </Card>
    </main>
  );
}
