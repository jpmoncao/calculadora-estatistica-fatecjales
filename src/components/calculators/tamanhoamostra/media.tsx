// import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react"

const formSchema = z.object({
    'desvio-padrao': z.coerce.number({
        required_error: "O desvio padrão é obrigatório.",
        invalid_type_error: "Informe um número válido para o desvio padrão.",
    }).min(0, { message: "O desvio padrão deve ser maior ou igual a 0." }),
    'grau-de-confianca': z.string({
        required_error: "O grau de confiança é obrigatório.",
    }),
    'erro-media': z.coerce.number({
        required_error: "O desvio padrão é obrigatório.",
        invalid_type_error: "Informe um número válido para o desvio padrão.",
    }).min(0, { message: "O desvio padrão deve ser maior ou igual a 0." }),
    'tamanho-amostra': z.string().optional(),
    'tamanho-amostra-aprox': z.string().optional()
});

export default function CalculadoraTamanhoAmostraMedia() {
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const desvioPadrao = values['desvio-padrao'];
            const grauConfianca = parseFloat(values['grau-de-confianca']);
            const erroMedia = values['erro-media'];
       
            const zMap: Record<number, number> = {
                0.90: 1.645,
                0.95: 1.96,
                0.99: 2.576,
            };
            const z = zMap[grauConfianca];

            if (!z) {
                toast.error("Grau de confiança inválido. Selecione 90%, 95% ou 99%.");
                return;
            }

            const tamanhoAmostra = (desvioPadrao * z / erroMedia) ** 2;

            if (isNaN(tamanhoAmostra) || tamanhoAmostra <= 0) {
                toast.error("O tamanho da amostra não pode ser calculado com os valores fornecidos.");
                return;
            }

            const tamanhoAmostraAproximado = Math.ceil(tamanhoAmostra);

            form.setValue('tamanho-amostra', tamanhoAmostra.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            form.setValue('tamanho-amostra-aprox', tamanhoAmostraAproximado.toLocaleString('pt-BR', {
                maximumFractionDigits: 0
            }));
        } catch (error) {
            console.error("Erro ao calcular tamanho da amostra", error);
            toast.error("Falha ao calcular. Verifique os dados.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 border rounded-2xl px-8 mb-16 transition-all duration-300 ease-in shadow-lg ">
                <div className="grid grid-cols-12 gap-4 w-full">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="grau-de-confianca"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grau de Confiança (z)</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            defaultValue=""
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0.9">90%</SelectItem>
                                                <SelectItem value="0.95">95%</SelectItem>
                                                <SelectItem value="0.99">99%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    <FormMessage className="relative text-xs text-red-500 mt-1 text-start" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="desvio-padrao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Desvio Padrão</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0,00"
                                            type="number"
                                            {...field} />
                                    </FormControl>


                                    <FormMessage className="relative text-xs text-red-500 mt-1 text-start" />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="erro-media"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Erro de Média (Em)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            {...field} />
                                    </FormControl>


                                    <FormMessage className="relative text-xs text-red-500 mt-1 text-start" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormLabel>Tamanho da Amostra</FormLabel>

                <div className="grid grid-cols-12 gap-4 w-full items-center text-center">
                    <div className="col-span-5">
                        <FormField
                            control={form.control}
                            name="tamanho-amostra"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled
                                            className="bg-muted font-bold text-primary"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage className="relative text-xs text-red-500 mt-1 text-start" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-2"><ArrowRight className="mx-auto" /></div>
                    <div className="col-span-5">
                        <FormField
                            control={form.control}
                            name="tamanho-amostra-aprox"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled
                                            className="bg-muted font-bold text-primary"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage className="relative text-xs text-red-500 mt-1 text-start" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit">Calcular</Button>
            </form>
        </Form >
    )
}