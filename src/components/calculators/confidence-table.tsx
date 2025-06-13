import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestionIcon } from "lucide-react";

export default function ConfidenceTableModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <MessageCircleQuestionIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Valores de Z para Intervalos de Confiança</DialogTitle>
                </DialogHeader>
                <table className="w-full text-sm text-left border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-2 py-1 border">Confiança (%)</th>
                            <th className="px-2 py-1 border">Alfa (α)</th>
                            <th className="px-2 py-1 border">α / 2</th>
                            <th className="px-2 py-1 border">Z</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-2 py-1 border text-center">90%</td>
                            <td className="px-2 py-1 border text-center">0,10</td>
                            <td className="px-2 py-1 border text-center">0,05</td>
                            <td className="px-2 py-1 border text-center">1,645</td>
                        </tr>
                        <tr>
                            <td className="px-2 py-1 border text-center">95%</td>
                            <td className="px-2 py-1 border text-center">0,05</td>
                            <td className="px-2 py-1 border text-center">0,025</td>
                            <td className="px-2 py-1 border text-center">1,960</td>
                        </tr>
                        <tr>
                            <td className="px-2 py-1 border text-center">99%</td>
                            <td className="px-2 py-1 border text-center">0,01</td>
                            <td className="px-2 py-1 border text-center">0,005</td>
                            <td className="px-2 py-1 border text-center">2,576</td>
                        </tr>
                    </tbody>
                </table>
            </DialogContent>
        </Dialog>
    );
}
