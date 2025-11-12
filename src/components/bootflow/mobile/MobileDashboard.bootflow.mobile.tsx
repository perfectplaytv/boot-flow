import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDeviceDetect } from '@/hooks/useDeviceDetect.bootflow.mobile';

export interface MobileDashboardCard {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface MobileDashboardProps {
  cards: MobileDashboardCard[];
  onCardChange?: (index: number) => void;
}

export const MobileDashboard = ({ cards, onCardChange }: MobileDashboardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMobile } = useDeviceDetect();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onCardChange?.(newIndex);
    } else if (info.offset.x < -threshold && currentIndex < cards.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onCardChange?.(newIndex);
    }
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
    onCardChange?.(index);
  };

  if (!isMobile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {card.icon}
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>{card.content}</CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ width: `${cards.length * 100}%` }}
        >
          {cards.map((card, index) => (
            <div key={card.id} className="w-full flex-shrink-0 px-4" style={{ width: `${100 / cards.length}%` }}>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {card.icon}
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{card.content}</CardContent>
              </Card>
            </div>
          ))}
        </motion.div>
      </div>

      {cards.length > 1 && (
        <>
          <div className="flex justify-center gap-2 mt-4">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-violet-600' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {currentIndex > 0 && (
            <button
              onClick={() => goToCard(currentIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-800/80 p-2 text-white shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {currentIndex < cards.length - 1 && (
            <button
              onClick={() => goToCard(currentIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-800/80 p-2 text-white shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

