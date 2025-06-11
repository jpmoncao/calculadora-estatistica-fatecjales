import React from "react"
import { toast } from "sonner"
import { useForm, useWatch } from "react-hook-form"
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
    proporcao: z.coerce.number({
        required_error: "A proporção é obrigatória.",
        invalid_type_error: "Informe um número válido para a proporção.",
    }).min(0, { message: "A proporção deve ser maior ou igual a 0." })
        .max(1, { message: "A proporção deve ser menor ou igual a 1." }),
    'resto-proporcao': z.coerce.number().optional(),
    'grau-de-confianca': z.string({
        required_error: "O valor de grau de confiança é obrigatório.",
    }),
    'erro-padrao': z.coerce.number({
        required_error: "O erro padrão é obrigatório.",
        invalid_type_error: "Informe um número válido para o erro padrão.",
    }).min(0, { message: "O erro padrão deve ser maior ou igual a 0." }),
    'tamanho-amostra': z.string().optional(),
    'tamanho-amostra-aprox': z.string().optional()
});

export default function CalculadoraTamanhoAmostraProporcao() {
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    const proporcao = useWatch({
        control: form.control,
        name: "proporcao",
    });

    React.useEffect(() => {
        if (proporcao < 0 || proporcao > 1 || !proporcao) {
            form.setValue("resto-proporcao", 0.00, {
                shouldValidate: true,
                shouldDirty: true,
            });

            return;
        }

        const q = Number((1 - proporcao).toFixed(4));
        form.setValue("resto-proporcao", q, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [proporcao]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const proporcao = values['proporcao'];
            const restoProporcao = values['resto-proporcao'];
            const grauConfianca = parseFloat(values['grau-de-confianca']);
            const erroPadrao = values['erro-padrao'];

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

            if (!restoProporcao || restoProporcao < 0 || restoProporcao > 1) {
                toast.error("O valor de 1 - p deve ser um número entre 0 e 1.");
                return;
            }

            const tamanhoAmostra = (z ** 2 * proporcao * restoProporcao) / (erroPadrao ** 2);

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
                            name="proporcao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proporção (p)</FormLabel>
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
                            name="resto-proporcao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>1 - p</FormLabel>
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
                            name="erro-padrao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Erro Padrão (Ep)</FormLabel>
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