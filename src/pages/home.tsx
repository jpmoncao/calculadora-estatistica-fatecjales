import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

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
          <Link to="/calculadora-intervalo-confianca">
            <Button variant={"outline"}>Abrir calculadora</Button>
          </Link>
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
          <Link to="/calculadora-tamanho-amostra">
            <Button variant={"outline"}>Abrir calculadora</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
