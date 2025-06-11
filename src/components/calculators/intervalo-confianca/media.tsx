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

const formSchema = z.object({
    media: z.coerce.number({
        required_error: "A média é obrigatória.",
        invalid_type_error: "Informe um número válido para a média.",
    }).min(0, { message: "A média deve ser maior ou igual a 0." }),

    'desvio-padrao': z.coerce.number({
        required_error: "O desvio padrão é obrigatório.",
        invalid_type_error: "Informe um número válido para o desvio padrão.",
    }).min(0, { message: "O desvio padrão deve ser maior ou igual a 0." }),

    'tamanho-amostra': z.coerce.number({
        required_error: "O tamanho da amostra é obrigatório.",
        invalid_type_error: "Informe um número válido para o tamanho da amostra.",
    }).min(0, { message: "O tamanho da amostra deve ser maior ou igual a 0." }),

    alfa: z.string({
        required_error: "O nível de significância (alfa) é obrigatório.",
    }),

    'erro-media': z.string().optional(),
    'intervalo-confianca-min': z.string().optional(),
    'intervalo-confianca-max': z.string().optional()
});

export default function CalculadoraIntervaloConfiancaMedia() {
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const alfa = Number(values.alfa);
            if (![0.10, 0.05, 0.01].includes(alfa)) {
                toast.error("Selecione um valor válido para alfa.");
                return;
            }

            // Mapeamento simples alfa → z
            const zMap: Record<number, number> = {
                0.10: 1.645,
                0.05: 1.96,
                0.01: 2.576,
            };
            const z = zMap[alfa];

            const erroMedia = (values['desvio-padrao'] / Math.sqrt(values['tamanho-amostra'])) * z;

            const inferior = values.media - erroMedia;
            const superior = values.media + erroMedia;

            if (isNaN(inferior) || isNaN(superior) || isNaN(erroMedia)) {
                toast.error("O intervalo de confiança não pode ser calculado com os valores fornecidos.");
                return;
            }

            form.setValue('erro-media', erroMedia.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            form.setValue('intervalo-confianca-min', inferior.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            form.setValue('intervalo-confianca-max', superior.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));
        } catch (error) {
            console.error("Erro ao calcular intervalo de confiança", error);
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
                            name="media"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Média</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0,00"
                                            type="number"
                                            step="0.01"
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
                </div>

                <div className="grid grid-cols-12 gap-4 w-full">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="tamanho-amostra"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tamanho da amostra (n)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0"
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
                            name="alfa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alfa (α)</FormLabel>
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
                                                <SelectItem value="0.10">0,10</SelectItem>
                                                <SelectItem value="0.05">0,05</SelectItem>
                                                <SelectItem value="0.01">0,01</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    <FormMessage className="relative text-xs text-red-500 mt-1 text-start" />
                                </FormItem>
                            )}
                        />

                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="erro-media"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Erro de Média (Em)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder=""
                                    disabled
                                    className="font-bold bg-muted text-destructive"
                                    {...field} />
                            </FormControl>


                            <FormMessage className="relative text-xs text-red-500 mt-1 text-start" />
                        </FormItem>
                    )}
                />

                <FormLabel>Intervalo de Confiança</FormLabel>

                <div className="grid grid-cols-12 gap-4 w-full items-center text-center">
                    <div className="col-span-5">
                        <FormField
                            control={form.control}
                            name="intervalo-confianca-min"
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
                    <div className="col-span-2"><span className="text-foreground font-bold">&lt; π &lt;</span></div>
                    <div className="col-span-5">
                        <FormField
                            control={form.control}
                            name="intervalo-confianca-max"
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