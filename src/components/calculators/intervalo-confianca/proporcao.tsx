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

const formSchema = z.object({
    proporcao: z.coerce.number({
        required_error: "A proporção é obrigatória.",
        invalid_type_error: "Informe um número válido para a proporção.",
    }).min(0, { message: "A proporção deve ser maior ou igual a 0." })
        .max(1, { message: "A proporção deve ser menor ou igual a 1." }),
    'resto-proporcao': z.coerce.number().optional(),
    'tamanho-amostra': z.coerce.number({
        required_error: "O tamanho da amostra é obrigatório.",
        invalid_type_error: "Informe um número válido para o tamanho da amostra.",
    }).min(0, { message: "O tamanho da amostra deve ser maior ou igual a 0." }),
    'grau-de-confianca': z.string({
        required_error: "O valor de grau de confiança é obrigatório.",
    }),
    'erro-padrao': z.string().optional(),
    'intervalo-confianca-min': z.string().optional(),
    'intervalo-confianca-max': z.string().optional()
});

export default function CalculadoraIntervaloConfiancaProporcao() {
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
            const p = values.proporcao;
            const q = 1 - p;
            const n = values['tamanho-amostra'];
            const z = parseFloat(values['grau-de-confianca']);

            const erroPadrao = z * Math.sqrt((p * q) / n);

            const inferior = p - erroPadrao;
            const superior = p + erroPadrao;

            if (isNaN(inferior) || isNaN(superior) || isNaN(erroPadrao)) {
                toast.error("O intervalo de confiança não pode ser calculado com os valores fornecidos.");
                return;
            }

            form.setValue('erro-padrao', erroPadrao.toLocaleString('pt-BR', {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 bg-secondary rounded-2xl px-8 mb-16 transition-all duration-300 ease-in shadow-lg ">
                <div className="grid grid-cols-12 gap-4 w-full">
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
                            name="resto-proporcao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>1 - p</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0,00"
                                            type="number"
                                            readOnly
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
                            name="grau-de-confianca"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grau de Confiança</FormLabel>
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
                                                <SelectItem value="1.645">1,645</SelectItem>
                                                <SelectItem value="1.96">1,96</SelectItem>
                                                <SelectItem value="2.575">2,575</SelectItem>
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
                    name="erro-padrao"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Erro Padrão (Ep)</FormLabel>
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