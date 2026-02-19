import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const VoiceCampaigns = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-10 w-10 sm:h-9 sm:w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Campanhas por Voz</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Gerencie campanhas de voz</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCampaigns;