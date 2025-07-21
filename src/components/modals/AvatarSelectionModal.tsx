import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { CheckCircle } from 'lucide-react';

const avatarOptions = [
  'https://source.boringavatars.com/beam/120/Admin?colors=7e22ce,a855f7,6d28d9,e9d5ff',
  'https://source.boringavatars.com/marble/120/Reseller?colors=16a34a,4ade80,15803d,dcfce7',
  'https://source.boringavatars.com/pixel/120/Client?colors=2563eb,60a5fa,1d4ed8,dbeafe',
  'https://source.boringavatars.com/sunset/120/Support?colors=f59e0b,fcd34d,b45309,fefce8',
  'https://source.boringavatars.com/ring/120/Manager?colors=dc2626,f87171,b91c1c,fee2e2',
  'https://source.boringavatars.com/bauhaus/120/Developer?colors=8b5cf6,c4b5fd,a78bfa,ede9fe'
];

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarSelectionModal = ({ isOpen, onClose }: AvatarSelectionModalProps) => {
  const { avatar, setAvatar } = useUser();

  const handleSelectAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1f2937] to-[#111827] border-purple-700 text-white max-w-lg shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-300">Selecione um Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {avatarOptions.map((src, index) => (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => handleSelectAvatar(src)}
            >
              <Avatar className="h-24 w-24 border-4 border-transparent group-hover:border-purple-500 transition-all rounded-full">
                <AvatarImage src={src} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              {avatar === src && (
                <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 