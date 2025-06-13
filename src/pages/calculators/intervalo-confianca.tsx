import React from "react";
import CalculadoraIntervaloConfiancaMedia from "@/components/calculators/intervalo-confianca/media";
import CalculadoraIntervaloConfiancaProporcao from "@/components/calculators/intervalo-confianca/proporcao";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import ConfidenceTableModal from "@/components/calculators/confidence-table";

export default function IntervaloCobranca() {
    const [calculadora, setCalculadora] = React.useState<"media" | "proporcao" | null>(null);

    const handleSelectChange = (value: string) => {
        if (value === "media" || value === "proporcao") {
            setCalculadora(value);
        } else {
            setCalculadora(null);
        }
    };

    return (
        <main className="container">
            <div className="flex flex-col items-center justify-center gap-4 mt-8 text-center">
                <div>
                    <h1 className="text-2xl font-extrabold">Calculadora </h1>
                    <h1 className="font-math text-3xl font-">Intervalo de Confiança</h1>
                </div>

                <p className="text-sm max-w-2/3">Calcule o intervalo de confiança para a média ou proporção de uma população com base em sua amostra.</p>

                <div className="flex gap-2">
                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo de cálculo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="proporcao">Proporção</SelectItem>
                        </SelectContent>
                    </Select>

                    <ConfidenceTableModal />
                </div>

                {calculadora === "media" && <CalculadoraIntervaloConfiancaMedia />}
                {calculadora === "proporcao" && <CalculadoraIntervaloConfiancaProporcao />}

            </div>
        </main>
    );
}