import {Card} from "@/components/ui/card";
import {CheckCircle, Clock, SearchCheck, Shield} from "lucide-react";

export function QuotationVerificationStep() {
    return (
        <div className="max-w-4xl mx-auto px-4">
            <Card className="bg-white/50 p-8 text-center shadow-lg">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-[#f5ebdd] rounded-full flex items-center justify-center">
                        <SearchCheck className="w-8 h-8 text-ejaar-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-ejaar-700">Dossier en cours de vérification</h2>
                    <p className="text-gray-600 max-w-md">
                        Votre dossier est actuellement en cours de vérification par notre équipe.
                        Vous serez notifié une fois la validation terminée.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-lg">
                        <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-ejaar-green" />
                                <span className="text-sm font-medium text-ejaar-green">Documents reçus</span>
                            </div>
                            <p className="text-sm text-ejaar-700">
                                Tous les documents requis ont été téléchargés avec succès.
                            </p>
                        </div>

                        <div className="bg-ejaar-beige border border-ejaar-beigeDark rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-5 h-5 text-ejaar-red" />
                                <span className="text-sm font-medium text-ejaar-red">En vérification</span>
                            </div>
                            <p className="text-sm text-ejaar-700">
                                Délai estimé: 2-3 jours ouvrables.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
